import {Directive, effect, ElementRef, inject, input, model, OnDestroy, OnInit} from '@angular/core';
import {NG_VALUE_ACCESSOR, NgControl, ValidationErrors} from "@angular/forms";
import {AsControl, AsControlForm, AsControlInput, AsControlSingleForm, AsControlValueAccessor} from "../../as-control";
import {MetaSignal} from "../../../meta-signal/meta-signal";
import {Constructor} from "../../../domain/container/ActiveObject";

@Directive({
    selector: 'form[asModel], fieldset[asName]',
    exportAs : "AsForm",
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

    newInstance = input<Constructor<any>>(null)

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


    toggleDisabled() {
        this.setDisabledState(! this.el.disabled)
    }

    setDisabledState(isDisabled: boolean): void {
        if (isDisabled) {
            this.model.set(null)
        } else {
            let model = this.model();
            if (! model) {
                let newInstance = this.newInstance();
                if (newInstance) {
                    let instance = (this.form as any).model().$instance(newInstance);
                    this.model.set(instance)
                }
            }
        }
        this.el.disabled = isDisabled;
        this.controls.forEach(control => {
            if (control instanceof AsControlInput) {
                control.valueAccessor.setDisabledState(isDisabled)
            }
        })
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
