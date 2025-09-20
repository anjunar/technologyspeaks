import {Directive, effect, ElementRef, inject, input, model, OnDestroy, OnInit} from '@angular/core';
import {NG_VALUE_ACCESSOR, NgControl, ValidationErrors} from "@angular/forms";
import {AsControl, AsControlForm, AsControlSingleForm, AsControlValueAccessor, AsFormGroup} from "../../as-control";
import {MetaSignal} from "../../../meta-signal/meta-signal";
import {ObjectDescriptor} from "../../../domain/descriptors";
import {AsFormArray} from "../../../components/input/as-form-array/as-form-array";

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
        },
        {
            provide: AsControlForm,
            useExisting: AsForm
        }
    ]
})
export class AsForm extends AsControlSingleForm implements AsControlValueAccessor, OnInit, OnDestroy {

    onChangeListener = (name: string, val: any) => {
        if (this.model()) {
            this.model()[name].set(val)
        }
    };

    model = model<any>({}, {alias: "asModel"})

    formName = input<string>(null, {alias: "name"})

    form = inject(AsControlForm, {skipSelf : true, optional : true})

    el = inject<ElementRef<HTMLFormElement | HTMLFieldSetElement>>(ElementRef<HTMLFormElement | HTMLFieldSetElement>)
        .nativeElement

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
            if (this.form instanceof AsForm) {
                this.form.addControl(this.formName(), this)
            }
        } else {
            this.descriptor = this.model().$meta.descriptors
        }
    }

    ngOnDestroy(): void {
        if (this.form instanceof AsForm) {
            this.form.removeControl(this.formName(), this)
        }
    }

    addControl(name : string | number, control: AsControl) {
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
                valueAccessor.writeDefaultValue(value);
            }
        }

        this.control.addControl(name as string, control.control);

        control.controlAdded();
    }

    removeControl(name : string | number, control: AsControl) {
        control.valueAccessor.unRegisterOnChange(this.onChangeListener);
        this.control.removeControl(name as string)
    }

    override get value(): any {
        return this.model();
    }

    writeValue(obj: any): void {
        this.model.set(obj);
    }

    writeDefaultValue(obj: any): void {
    }

    setDisabledState?(isDisabled: boolean): void {
        this.el.disabled = isDisabled;
        Object.values(this.control.controls).forEach(c => {
            if ((c as any).valueAccessor) {
                (c as any).valueAccessor.setDisabledState(isDisabled);
            }
        });
    }

    override get dirty(): boolean {
        return Object.values(this.control.controls).some(c => (c as any).dirty);
    }

    override get pristine(): boolean {
        return !this.dirty;
    }

    override get errors(): ValidationErrors | null {
        const merged: ValidationErrors = {};
        Object.entries(this.control.controls).forEach(([name, c]) => {
            if ((c as any).errors) merged[name] = (c as any).errors;
        });
        return Object.keys(merged).length ? merged : null;
    }

    override get touched(): boolean {
        return Object.values(this.control.controls).some(c => (c as any).touched);
    }

    override get path(): string[] | null {
        return this.formName() ? [this.formName()] : null;
    }

    override valueAccessor: AsControlValueAccessor = this;
}
