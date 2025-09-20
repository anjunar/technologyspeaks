import {Directive, effect, ElementRef, inject, input, model, OnDestroy, OnInit} from '@angular/core';
import {NG_VALUE_ACCESSOR, NgControl, ValidationErrors} from "@angular/forms";
import {AsControl, AsControlForm, AsControlInput, AsControlSingleForm, AsControlValueAccessor} from "../../as-control";
import {MetaSignal} from "../../../meta-signal/meta-signal";

@Directive({
    selector: 'form[asModel], fieldset[asName]',
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

    form = inject(AsControlForm, {skipSelf: true, optional: true})

    el = inject<ElementRef<HTMLFormElement | HTMLFieldSetElement>>(ElementRef<HTMLFormElement | HTMLFieldSetElement>)
        .nativeElement

    constructor() {
        super();
        effect(() => {

            if (this.formName()) {
                this.el.name = this.formName()
            }

            if (this.model()) {
                this.setDisabledState(false)
            } else {
                this.setDisabledState(true)
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

    override get value(): any {
        return this.model();
    }

    writeValue(obj: any): void {
        this.model.set(obj);
    }

    setDisabledState(isDisabled: boolean): void {
        this.el.disabled = isDisabled;
        this.controls.forEach(control => (control as any).setDisabledState(isDisabled))
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
