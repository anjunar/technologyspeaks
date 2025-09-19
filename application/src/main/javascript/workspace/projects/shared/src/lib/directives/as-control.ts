import {
    AbstractControl,
    AbstractControlOptions,
    AsyncValidatorFn,
    ControlValueAccessor, FormArray,
    FormControl,
    FormGroup,
    NgControl,
    ValidatorFn
} from "@angular/forms";
import {AsForm, CollectionDescriptor, NodeDescriptor, ObjectDescriptor} from "shared";
import PropDescriptor from "../domain/descriptors/PropDescriptor";
import {Directive, inject, input, OnDestroy, OnInit} from "@angular/core";

export class AsFormGroup extends FormGroup {
    constructor(
        controls: { [key: string]: AbstractControl } = {},
        validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
        asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
    ) {
        super(controls, validatorOrOpts, asyncValidator);
    }

    override addControl(name: string, control: AbstractControl, options?: { emitEvent?: boolean }): void {
        const existing = this.controls[name];

        if (!existing) {
            super.addControl(name, control, options);
            return;
        }

        if (existing instanceof FormGroup && control instanceof FormGroup) {
            this.registerLazyChildren(existing, control);
            return;
        }

        this.setControl(name, control, options);
    }

    private registerLazyChildren(target: FormGroup, source: FormGroup) {
        Object.keys(source.controls).forEach(key => {
            if (!target.contains(key)) {
                target.addControl(key, source.get(key)!);
            }
        });

        const originalAdd = source.addControl.bind(source);
        source.addControl = (childName: string, childControl: AbstractControl, options?: { emitEvent?: boolean }) => {
            if (!target.contains(childName)) {
                target.addControl(childName, childControl, options);
            } else {
                target.setControl(childName, childControl, options);
            }
            originalAdd(childName, childControl, options);
        };
    }
}

export interface AsControlValueAccessor extends ControlValueAccessor {

    writeDefaultValue(obj: any): void

    unRegisterOnChange(fn: any): void

}

export abstract class AsControl extends NgControl {

    onChange: ((name: string, value: any) => void)[] = []
    onTouched: (() => void)[] = []

    instance: PropDescriptor

    abstract descriptor: NodeDescriptor

    abstract controlAdded(): void

    registerOnChange(fn: any): void {
        this.onChange.push(fn)
    }

    unRegisterOnChange(fn: any): void {
        let indexOf = this.onChange.indexOf(fn);
        this.onChange.splice(indexOf, 1)
    }

    registerOnTouched(fn: any): void {
        this.onTouched.push(fn)
    }

    abstract override valueAccessor: AsControlValueAccessor

    override viewToModelUpdate(newValue: any): void {
        this.valueAccessor.writeValue(newValue);
    }

}

@Directive()
export abstract class AsControlInput extends AsControl implements OnInit, OnDestroy {

    inputName = input<string>("", {alias: "name"})

    form = inject(AsForm)

    override control: AbstractControl = new FormControl()

    override descriptor: NodeDescriptor

    abstract get placeholder(): string
    abstract set placeholder(value: string)

    ngOnInit(): void {
        this.form.addControl(this.inputName(), this)
    }

    ngOnDestroy(): void {
        this.form.removeControl(this.inputName(), this)
    }

}

export abstract class AsControlForm extends AsControl {

    override control: FormGroup = new AsFormGroup({})

    override descriptor: ObjectDescriptor
}

export abstract class AsControlArrayForm extends AsControl {

    override control: FormArray = new FormArray([])

    override descriptor: ObjectDescriptor
}
