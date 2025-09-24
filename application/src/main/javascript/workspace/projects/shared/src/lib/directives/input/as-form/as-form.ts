import {Directive, effect, ElementRef, forwardRef, inject, input, OnDestroy, OnInit} from '@angular/core';
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {AsControlForm, AsControlInput, AsControlSingleForm, AsControlValueAccessor} from "../../as-control";
import {Constructor} from "../../../domain/container/ActiveObject";

@Directive({
    selector: 'form[asModel], fieldset[asName]',
    exportAs: "AsForm",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AsForm),
            multi: true,
        },
        {
            provide: AsControlForm,
            useExisting: forwardRef(() => AsForm)
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

            if (this.name()) {
                this.el.name = this.name()
            }
        });
    }

    controlAdded(): void {
        if (this.model()) {
            this.setDisabledState(false)
        } else {
            this.setDisabledState(true)
        }
    }

    ngOnInit(): void {
        if (this.form) {
            if (this.form instanceof AsForm) {
                this.form.addControl(this.name(), this)
            }
        } else {
            this.descriptor = this.model().$meta.descriptors
        }
    }

    ngOnDestroy(): void {
        if (this.form instanceof AsForm) {
            this.form.removeControl(this.name(), this)
        }
    }

    writeValue(obj: any): void {
        this.model.set(obj);
    }


    toggleDisabled() {
        this.setDisabledState(!this.el.disabled)
    }

    setDisabledState(isDisabled: boolean): void {
        let presentValue = this.model();
        if (isDisabled && presentValue) {
            this.model.set(null)
            this.status.set("DISABLED")
            this.controls.forEach(controls => {
                controls.forEach(control => {
                    control.model.set(null)
                    control.errors.set([])
                    control.dirty.set(false)
                    control.setDisabledState(isDisabled)
                    this.status.set("DISABLED")
                    if (control instanceof AsControlInput) {
                        control.writeDefaultValue(null)
                    }
                })
            })
        } else {
            if (!presentValue) {
                let newInstance = this.newInstance();
                if (newInstance) {
                    let instance = (this.form as any).model().$instance(newInstance);
                    this.model.set(instance)
                    this.status.set("ENABLED")

                    this.controls.forEach(controls => {
                        controls.forEach(control => {
                            let value = this.model()[control.name()]();
                            control.model.set(value)
                            control.errors.set([])
                            control.dirty.set(false)
                            control.setDisabledState(isDisabled)
                            control.status.set("ENABLED")

                            if (control instanceof AsControlInput) {
                                control.writeDefaultValue(value)
                            }
                        })
                    })
                }
            }
        }
        this.el.disabled = isDisabled;
    }

}
