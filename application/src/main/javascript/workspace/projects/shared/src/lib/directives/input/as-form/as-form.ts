import {Directive, effect, ElementRef, inject, input, model, OnDestroy, OnInit} from '@angular/core';
import {FormControl, NG_VALUE_ACCESSOR, NgControl, ValidationErrors} from "@angular/forms";
import {AsControl, AsControlForm, AsControlInput, AsControlValueAccessor} from "../../as-control";
import {MetaSignal} from "../../../meta-signal/meta-signal";
import {ObjectDescriptor} from "../../../domain/descriptors";

@Directive({
    selector: 'form[asModel], fieldset',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: AsForm,
            multi: true,
        },
        {
            provide: NgControl,
            useExisting: AsForm,
            multi: true
        }
    ]
})
export class AsForm extends AsControlForm implements AsControlValueAccessor, OnInit, OnDestroy {

    onChangeListener = (name: string, val: any) => {
        if (this.model()) {
            this.model()[name].set(val)
        }
    };

    model = model<any>({}, {alias: "asModel"})

    formName = input<string>(null, {alias: "name"})

    form = inject(AsForm, {skipSelf: true, optional: true})

    el = inject<ElementRef<HTMLFormElement | HTMLFieldSetElement>>(ElementRef<HTMLFormElement | HTMLFieldSetElement>)
        .nativeElement

    controls: Map<string, AsControl[]> = new Map()

    constructor() {
        super();
        effect(() => {
            if (this.model()) {
                this.valueAccessor.setDisabledState(false)
            } else {
                this.valueAccessor.setDisabledState(true)
            }
        });
    }

    controlAdded(): void {
    }

    ngOnInit(): void {
        if (this.form) {
            this.form.addControl(this.formName(), this)
            this.descriptor = this.form.descriptor.properties[this.formName()] as ObjectDescriptor
        } else {
            this.descriptor = this.model().$meta.descriptors
        }
    }

    ngOnDestroy(): void {
        if (this.form) {
            this.form.removeControl(this.formName(), this)
        }
    }

    addControl(name: string, control: AsControl) {
        let controls = this.controls.get(name);
        if (controls) {
            controls.push(control)
        } else {
            this.controls.set(name, [control])
        }

        let model = this.model();
        control.descriptor = this.descriptor.properties[name]

        if (model) {
            let metaSignal: MetaSignal<any> = model[name];
            let valueAccessor = control.valueAccessor;
            valueAccessor.registerOnChange(this.onChangeListener)

            if (metaSignal) {
                let value = metaSignal();
                control.instance = metaSignal.instance
                valueAccessor.writeValue(value)
                valueAccessor.writeDefaultValue(value)
            }
        }

        if (control instanceof AsControlForm) {
            this.control.addControl(name, control.control);
        }

        if (control instanceof AsControlInput) {
            const formControl = new FormControl(
                {value: control.value, disabled: control.disabled}
            );
            control.control = formControl
            this.control.addControl(name, formControl);
        }

        control.controlAdded()

    }

    removeControl(name: string, control: AsControl) {
        let controls = this.controls.get(name);
        let indexOf = controls.indexOf(control);
        if (indexOf > -1) {
            controls[indexOf].valueAccessor.unRegisterOnChange(this.onChangeListener)
            controls.splice(indexOf, 1)
        }
        this.control.removeControl(name, {emitEvent: true})
    }

    override get value(): any {
        return this.model()
    }

    writeValue(obj: any): void {
        this.model.set(obj)
    }

    writeDefaultValue(obj: any): void {
    }

    setDisabledState?(isDisabled: boolean): void {
        this.el.disabled = isDisabled
        for (const controls of this.controls.values()) {
            for (const control of controls) {
                control.valueAccessor.setDisabledState(isDisabled)
            }
        }
    }

    override get dirty(): boolean {
        return Array.from(this.controls.values()).some(controls => controls.some(control => control.dirty))
    }

    override get pristine(): boolean {
        return !this.dirty
    }

    override get errors(): ValidationErrors | null {
        const merged: ValidationErrors = {};
        this.controls.forEach((controls, name) => {
            controls.forEach(control => {
                if (control.errors) merged[name] = control.errors;
            })
        });
        return Object.keys(merged).length ? merged : null;
    }

    override get touched(): boolean {
        return this.controls.size > 0 && Array.from(this.controls.values()).some(c => (c as any).touched);
    }

    override get path(): string[] | null {
        return this.formName() ? [this.formName()] : null;
    }

    override valueAccessor: AsControlValueAccessor = this
}
