import {LocalDate, LocalDateTime, LocalTime, Temporal, TemporalAccessor, TemporalAmount} from "@js-joda/core";
import {match} from "../../pattern-match/PatternMatching";
import NotNullValidator from "../../domain/descriptors/validators/NotNullValidator";
import NotBlankValidator from "../../domain/descriptors/validators/NotBlankValidator";
import SizeValidator from "../../domain/descriptors/validators/SizeValidator";
import EmailValidator from "../../domain/descriptors/validators/EmailValidator";
import PastValidator from "../../domain/descriptors/validators/PastValidator";
import {debounce} from "./Utils";
import PatternValidator from "../../domain/descriptors/validators/PatternValidator";
import JSONSerializer from "../../mapper/JSONSerializer";
import NodeDescriptor from "../../domain/descriptors/NodeDescriptor";
import {v4} from "uuid";
import ActiveObject from "../../domain/container/ActiveObject";


export const configureValidators = (property: NodeDescriptor): any => {
    return Object.values(property.validators || {}).reduce((current: any, prev: any) => {
        match(prev)
            .withObject(NotNullValidator, () => current["required"] = true)
            .withObject(NotBlankValidator, () => current["required"] = true)
            .withObject(EmailValidator, () => current["email"] = true)
            .withObject(PastValidator, () => current["past"] = true)
            .withObject(PatternValidator, (validator) => {
                current["pattern"] = validator.regexp
            })
            .withObject(SizeValidator, (validator) => {
                if (property.type === "String") {
                    if (validator.min) {
                        current["minLength"] = validator.min
                    }
                    if (validator.max) {
                        current["maxLength"] = validator.max
                    }
                } else {
                    if (validator.min) {
                        current["min"] = validator.min
                    }
                    if (validator.max) {
                        current["max"] = validator.max
                    }
                }
            })
            .exhaustive()
        return current
    }, {} as any)
}

function cloneDeep(object : any) : any {
    if (object instanceof Array) {
        return object.map(element => cloneDeep(element))
    } else {
        if (object instanceof Object) {
            if (object instanceof Temporal) {
                if (object instanceof LocalDate) {
                    return LocalDate.parse(object.toJSON())
                }
                if (object instanceof LocalDateTime) {
                    return LocalDateTime.parse(object.toJSON())
                }
                if (object instanceof LocalTime) {
                    return LocalTime.parse(object.toJSON())
                }
            } else {
                let Class = object.constructor;
                let instance = new Class()

                for (const name of Object.keys(object)) {
                    instance[name] = cloneDeep(object[name])
                }

                return instance
            }
        } else {
            return object
        }
    }
}

export class Model {

    id = v4()

    name: string
    valueHolder : any
    type : string

    errors: Error[] = []

    callbacks: ((validate: boolean) => void)[] = []

    validators: Validator[] = []
    asyncValidators: AsyncValidator[] = []

    oldValue : string | Node

    asyncValidate: () => void

    parentCallback = (validate: boolean) => {
        for (const callback of this.callbacks) {
            callback(validate)
        }
    }

    constructor(name: string, valueHolder: any, type : string) {
        this.name = name
        this.valueHolder = valueHolder
        this.type = type

        if (this.value instanceof Object) {
            if (this.value instanceof ActiveObject) {
                this.oldValue = JSON.stringify(JSONSerializer(this.value))
            } else {
                this.oldValue = JSON.stringify(this.value)
            }
        } else {
            this.oldValue = this.value
        }

        this.asyncValidate = debounce(() => {
            for (const validator of this.asyncValidators) {

                let value = this.value

                validator.validate(value)
                    .then((valid: any) => {
                        let index = this.errors.findIndex(
                            error => error.type === validator.type
                        )
                        if (index > -1) {
                            this.errors.splice(index, 1)
                        }
                        this.fireCallbacks(false)
                    })
                    .catch((error: any) => {
                        let index = this.errors.findIndex(
                            error => error.type === validator.type
                        )
                        if (index === -1) {
                            let items: any = {
                                type: validator.type,
                                payload: error
                            };

                            if (validator.property) {
                                items[validator.property] = (validator as any)[validator.property]
                            }

                            this.errors.push(items)
                        }
                        this.fireCallbacks(false)
                    })
            }
        }, 300)
    }

    get value() {
        return this.valueHolder[this.name]
    }

    set value(value : any) {
        this.valueHolder[this.name] = value
    }

    addValidator(value: Validator) {
        this.validators.push(value)
    }

    addAsyncValidator(value: AsyncValidator) {
        this.asyncValidators.push(value)
    }

    get dirty() {
        return !this.pristine
    }

    get pristine() {
        if (this.value instanceof Object) {
            if (this.value instanceof ActiveObject) {
                return this.oldValue === JSON.stringify(JSONSerializer(this.value))
            } else {
                return this.oldValue === JSON.stringify(this.value)
            }
        } else {
            return this.oldValue === this.value
        }
    }

    get valid() {
        return this.errors.length === 0
    }

    fireCallbacks(validate: boolean) {
        for (const callback of this.callbacks) {
            callback(validate)
        }
    }

    validate() {
        this.errors.length = 0
        this.errors.push(...this.errors.filter(error => error.type !== "server" && error.invalidValue === this.value))

        for (const validator of this.validators) {
            let validate = validator.validate(this.value)

            if (validate) {
                let index = this.errors.findIndex(
                    error => error.type === validator.type
                )
                if (index > -1) {
                    this.errors.splice(index, 1)
                }
            } else {
                let index = this.errors.findIndex(
                    error => error.type === validator.type
                )
                if (index === -1) {
                    let items: any = {
                        type: validator.type
                    };

                    if (validator.property) {
                        items[validator.property] = (validator as any)[validator.property]
                    }

                    this.errors.push(items)
                }
            }
        }

        this.asyncValidate();
    }
}

export class ArrayModel extends Model {

    data: FormModel[] = []

    constructor(name: string, value: string) {
        super(name, value, "array");
    }

    registerData(value: FormModel) {
        if (this.data.indexOf(value) === -1) {
            this.data.push(value)

            value.callbacks.push(this.parentCallback)
        }
    }

    removeData(value: FormModel) {
        this.data.splice(this.data.indexOf(value), 1)
        value.callbacks.splice(value.callbacks.indexOf(this.parentCallback), 1)
    }

}

export class FormModel extends Model {

    children: (FormModel | ArrayModel)[] = []
    inputs: Model[] = []
    registerButtons : ((button : HTMLButtonElement) => void)[] = []
    removeButtons : ((button : HTMLButtonElement) => void)[] = []

    constructor(name: string = "default", value: any) {
        super(name, {[name] : value}, "form");
    }

    registerInput(value: Model) {
        if (this.inputs.indexOf(value) === -1) {
            this.inputs.push(value)
            value.callbacks.push(this.parentCallback)
        }
    }

    removeInput(value: Model) {
        this.inputs.splice(this.inputs.indexOf(value), 1)
        value.callbacks.splice(value.callbacks.indexOf(this.parentCallback), 1)
    }

    registerChildren(value: FormModel | ArrayModel) {
        if (this.children.indexOf(value) === -1) {
            this.children.push(value)

            value.callbacks.push(this.parentCallback)
        }
    }

    removeChildren(value: FormModel | ArrayModel) {
        this.children.splice(this.children.indexOf(value), 1)
        value.callbacks.splice(value.callbacks.indexOf(this.parentCallback), 1)
    }

    registerButton(button : HTMLButtonElement) {
        for (const callback of this.registerButtons) {
            callback(button)
        }
    }

    removeButton(button : HTMLButtonElement) {
        for (const callback of this.removeButtons) {
            callback(button)
        }
    }

    collectErrors(form: any = this) {
        const result: any[] = []

        if (form.errors.length > 0) {
            result.push({
                class: form.value,
                errors: form.errors
            })
        }

        if (form.inputs instanceof Array) {
            form.inputs.forEach((input: any) => {
                if (input.errors.length > 0) {
                    result.push({
                        class: input.value,
                        property: input.name,
                        errors: input.errors
                    })
                }
            })
        }

        if (form.children instanceof Array) {
            form.children.forEach((child: any) => {
                result.push(...this.collectErrors(child))
            })
        }

        if (form.data instanceof Array) {
            form.data.forEach((child: any) => {
                result.push(...this.collectErrors(child))
            })
        }

        return result;
    }

    triggerCallbacks(form: any = this) {
        if (form.inputs instanceof Array) {
            form.inputs.forEach((input: any) => {
                input.fireCallbacks()
            })
        }

        if (form.children instanceof Array) {
            form.children.forEach((child: any) => {
                if (child.data instanceof Array) {
                    child.callbacks.forEach((callback: any) => callback())
                    child.data.forEach((child: any) => this.triggerCallbacks(child))
                } else {
                    this.triggerCallbacks(child)
                }
            })
        }
    }

    validateFields(form: any = this) {
        if (form.inputs instanceof Array) {
            form.inputs.forEach((input: any) => {
                input.validate()
            })
        }

        if (form.children instanceof Array) {
            form.children.forEach((child: any) => {
                if (child.data instanceof Array) {
                    child.validate()
                    child.data.forEach((child: any) => child.validateFields())
                } else {
                    child.validateFields()
                }
            })
        }
    }

    findModel(path: any[], form: any) : any {
        let segment = path.shift();
        if (typeof segment === "string") {
            let model = form.inputs.find((input: any) => input.name === segment);
            if (model) {
                return model
            } else {
                let m = form.children.filter((input: any) => input.name === segment);
                if (m.length > 0) {
                    for (const mElement of m) {
                        let findModel = this.findModel(Array.from(path), mElement);
                        if (findModel) {
                            return findModel
                        }
                    }

                }
            }
        } else {
            return this.findModel(path, form.data[segment])
        }
    }

    setErrors(errors: any[]) {
        for (const error of errors) {
            let input = this.findModel(Array.from(error.path), this);

            if (input?.errors.findIndex((er: any) => error.message === er.message) === -1) {
                input.errors.push({
                    type: "server",
                    path: error.path.join("."),
                    message: error.message
                })
            }

        }
        this.triggerCallbacks()
    }

    get valid() {
        return this.collectErrors(this).length === 0
    }

}

export interface Error {
    position: "client" | "server"

    type: string

    [key: string]: string
}


export interface Validator {

    type: string

    property?: string

    validate(value: any): boolean

}

export interface AsyncValidator {

    type: string

    property?: string

    validate(value: any): Promise<void>

}

export class Required implements Validator {
    type = "required"

    validate(value: any) {
        if (typeof value === "boolean") {
            return value !== undefined
        }
        if (typeof value === "string") {
            return value.length > 0
        }
        if (typeof value === "number") {
            return true
        }
        if (value instanceof Array) {
            return value.length > 0
        }
        if (value instanceof Temporal || value instanceof TemporalAccessor || value instanceof TemporalAmount) {
            return true
        }
        return false
    }
}

export class Min implements Validator {
    type = "min"

    property = "min"

    min: number

    constructor(min: number) {
        this.min = min
    }

    validate(value: any) {
        if (typeof value === "number") {
            return value > this.min
        }
        if (typeof value === "string") {
            const number = Number(value)
            return number > this.min
        }
        if (value instanceof Array) {
            return value.length >= this.min
        }
        return false
    }
}

export class Max implements Validator {
    type = "max"

    property = "max"

    max: number

    constructor(max: number) {
        this.max = max
    }

    validate(value: any) {
        if (typeof value === "number") {
            return value < this.max
        }
        if (typeof value === "string") {
            const number = Number(value)
            return number < this.max
        }
        if (value instanceof Array) {
            return value.length <= this.max
        }
        return false
    }
}

export class MinLength implements Validator {
    type = "minLength"

    property = "min"

    min: number

    constructor(min: number) {
        this.min = min
    }

    validate(value: any) {
        if (value === undefined) {
            return true
        }
        if (typeof value === "string") {
            return value.length === 0 || value.length > this.min
        }
        return false
    }
}

export class MaxLength implements Validator {
    type = "maxLength"

    property = "max"

    max: number

    constructor(max: number) {
        this.max = max
    }

    validate(value: any) {
        if (value === undefined) {
            return true
        }
        if (typeof value === "string") {
            return value.length < this.max
        }
        return false
    }
}

export class Pattern implements Validator {
    property = "pattern"
    type = "pattern"

    pattern: string

    constructor(pattern: string) {
        this.pattern = pattern
    }

    validate(value: any) {
        let regex = new RegExp(this.pattern)

        if (typeof value === "string") {
            return regex.test(value)
        }

        return false
    }
}

export class Email implements Validator {
    type = "email"

    validate(value: string) {
        let regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g
        return regex.test(value)
    }
}
