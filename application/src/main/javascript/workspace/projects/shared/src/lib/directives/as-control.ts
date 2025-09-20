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
import {AsForm, CollectionDescriptor, MetaSignal, NodeDescriptor, ObjectDescriptor} from "shared";
import PropDescriptor from "../domain/descriptors/PropDescriptor";
import {Directive, inject, input, model, OnDestroy, OnInit} from "@angular/core";

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

    unRegisterOnChange(fn: any): void

}

export abstract class AsControl extends NgControl {

    onChange: ((name: string, value: any) => void)[] = []
    onTouched: (() => void)[] = []

    instance: PropDescriptor

    abstract descriptor: NodeDescriptor

    abstract controlAdded() : void

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

    inputName = input<string>("", {alias: "asName"})

    form = inject(AsControlForm)

    override control: AbstractControl = new FormControl()

    override descriptor: NodeDescriptor

    abstract get placeholder(): string
    abstract set placeholder(value: string)

    abstract writeDefaultValue(obj: any): void

    ngOnInit(): void {
        this.form.addControl(this.inputName(), this)
    }

    ngOnDestroy(): void {
        this.form.removeControl(this.inputName(), this)
    }

}

@Directive()
export abstract class AsControlForm extends AsControl {

    formName = input<string>(null, {alias: 'asName'});

    isDisabled = model(false, {alias : "disabled"})

    abstract form : AsControlForm

    // @ts-ignore
    override get name() : string {
        return this.formName()
    }

    abstract addControl(name : string | number, control: AsControl) : void
    abstract removeControl(name : string | number, control: AsControl) : void
}

@Directive()
export abstract class AsControlSingleForm extends AsControlForm {

    onChangeListener = (name: string, val: any) => {
        if (this.model()) {
            this.model()[name].set(val)
        }
    };

    model = model<any>({}, {alias: "asModel"})

    override control: FormGroup = new AsFormGroup({})

    controls : Map<string, AsControl> = new Map()

    override descriptor: ObjectDescriptor

    addControl(name: string | number, control: AsControl) {
        this.controls.set(name as string, control)
        control.descriptor = this.descriptor.properties[name];
        const model = this.model();
        if (model) {
            const metaSignal: MetaSignal<any> = model[name];
            const valueAccessor = control.valueAccessor;
            valueAccessor.registerOnChange(this.onChangeListener);
            if (metaSignal) {
                const value = metaSignal();
                control.instance = metaSignal.instance;
                valueAccessor.writeValue(value);
                if (control instanceof AsControlInput) {
                    control.writeDefaultValue(value);
                }
            }
        }

        this.control.addControl(name as string, control.control);

        control.controlAdded();
    }

    removeControl(name: string | number, control: AsControl) {
        this.controls.delete(name as string)
        control.valueAccessor.unRegisterOnChange(this.onChangeListener);
        this.control.removeControl(name as string)
    }

}

export abstract class AsControlArrayForm extends AsControlForm {

    override control: FormArray = new FormArray([])

    override descriptor: ObjectDescriptor

}