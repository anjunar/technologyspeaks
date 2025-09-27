import {ControlValueAccessor} from "@angular/forms";
import {Directive, effect, inject, input, model, ModelSignal, OnDestroy, OnInit, Signal, Type} from "@angular/core";
import {MetaSignal} from "../meta-signal/meta-signal";
import Validator from "../domain/descriptors/validators/Validator";
import {value} from "../meta-signal/value-signal";

function bindSignals<T>(target: ModelSignal<T>, source: ModelSignal<T>) {
    const sub1 = source.subscribe(val => {
        if (target() !== val) {
            target.set(val);
        }
    });

    const sub2 = target.subscribe(val => {
        if (source() !== val) {
            source.set(val);
        }
    });

    return () => {
        sub1.unsubscribe();
        sub2.unsubscribe();
    };
}

export interface AsControlValueAccessor extends ControlValueAccessor {

    unRegisterOnChange(fn: any): void

}

@Directive()
export abstract class AsControl {

    onChange: ((name: string, value: any, defaultValue: any, el: HTMLElement) => void)[] = []
    onTouched: ((el: HTMLElement) => void)[] = []

    abstract get name(): Signal<string>

    dirty = model(false)

    errors = model<Validator[]>([])

    placeholder = model<string>()

    abstract controlAdded(): void

    abstract setDisabledState(isDisabled: boolean): void

    abstract get model(): ModelSignal<any>
    abstract set model(model: ModelSignal<any>)

    abstract el: HTMLElement

    status = value("INITIAL")

    validators: Validator[] = []

    constructor() {

        effect(() => {
            if (this.dirty()) {
                this.el.classList.add("dirty")
            } else {
                this.el.classList.remove("dirty")
            }

            if (this.errors().length) {
                this.el.classList.add("invalid")
                this.el.classList.remove("valid")
            } else {
                this.el.classList.add("valid")
                this.el.classList.remove("invalid")
            }
        });

        this.onChange.push((name, value, defaultValue, el) => {
            if (defaultValue === value) {
                this.dirty.set(false)
            } else {
                this.dirty.set(true)
            }

            this.writeValue(value)
            this.model.set(value)

            let errors = this.validators.filter(validator => !validator.validate(this));
            this.errors.set(errors)

        })
        this.onTouched.push((el) => {
            el.classList.remove("focus")
        })
    }

    addValidator(validator: Validator) {
        this.validators.push(validator)
    }

    abstract writeValue(obj: any): void

    registerOnChange(fn: (name: string, value: any) => void): void {
        this.onChange.push(fn)
    }

    unRegisterOnChange(fn: (name: string, value: any) => void): void {
        let indexOf = this.onChange.indexOf(fn);
        this.onChange.splice(indexOf, 1)
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched.push(fn)
    }

    abstract markAsNoError(): void

    abstract markAsPristine(): void

    abstract markAsDirty(): void


}

@Directive()
export abstract class AsControlInput extends AsControl implements OnInit, OnDestroy {

    name = input<string>("", {alias: "property"})

    model = value<any>(null)

    form = inject(AsControlForm)

    abstract writeDefaultValue(obj: any): void

    ngOnInit(): void {
        this.form.addControl(this.name(), this)
    }

    ngOnDestroy(): void {
        this.form.removeControl(this.name(), this)
    }

    override markAsNoError() {
        this.errors.set([])
    }

    override markAsPristine() {
        this.dirty.set(false)
    }

    override markAsDirty() {
        this.dirty.set(true)
    }
}

@Directive()
export abstract class AsControlForm extends AsControl {

    name = input<string>(null, {alias: 'property'});

    abstract form: AsControlForm

    abstract addControl(name: string | number, control: AsControl): void

    abstract removeControl(name: string | number, control: AsControl): void
}

@Directive()
export abstract class AsControlSingleForm extends AsControlForm {

    controls: Map<string, AsControl[]> = new Map()

    model = model<any>({}, {alias: "asModel"})

    newInstance: Type<any>

    addControl(name: string | number, control: AsControl) {
        let controls = this.controls.get(name as string);
        if (controls) {
            controls.push(control)
        } else {
            this.controls.set(name as string, [control])
        }
        const model = this.model();
        if (model) {
            const metaSignal: MetaSignal<any> = model[name];
            if (metaSignal) {
                control.model.set(metaSignal())

                bindSignals(metaSignal, control.model)

                let value = metaSignal()
                control.writeValue(value)
                if (control instanceof AsControlInput) {
                    control.writeDefaultValue(value);
                }
            }
        }

        control.controlAdded();
    }

    removeControl(name: string | number, control: AsControl) {
        let controls = this.controls.get(name as string);
        if (controls) {
            let indexOf = controls.indexOf(control);
            controls.splice(indexOf, 1)
        }
    }

    override markAsNoError() {
        this.errors.set([])
        this.controls.forEach((controls, key) => controls.forEach(control => control.markAsNoError()))
    }

    override markAsPristine() {
        this.dirty.set(false)
        this.controls.forEach((controls, key) => controls.forEach(control => control.markAsPristine()))
    }

    override markAsDirty() {
        this.dirty.set(false)
        this.controls.forEach((controls, key) => controls.forEach(control => control.markAsDirty()))
    }
}

@Directive()
export abstract class AsControlArrayForm extends AsControlForm {

    model = value([])

}