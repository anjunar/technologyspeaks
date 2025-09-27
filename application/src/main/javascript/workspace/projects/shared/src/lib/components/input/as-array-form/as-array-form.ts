import {Component, effect, ElementRef, inject, input, model, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {
    AsControl,
    AsControlArrayForm,
    AsControlForm, AsControlInput,
    AsControlSingleForm,
    AsControlValueAccessor
} from "../../../directives/as-control";
import {NG_VALUE_ACCESSOR, NgControl, ValidationErrors} from "@angular/forms";
import {AsIcon} from "../../layout/as-icon/as-icon";
import {AsFormArray} from "../as-form-array/as-form-array";

@Component({
    selector: 'array-form',
    imports: [
        AsIcon
    ],
    templateUrl: './as-array-form.html',
    styleUrl: './as-array-form.css',
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: AsArrayForm,
            multi: true,
        },
        {
            provide: AsControlForm,
            useExisting: AsArrayForm
        },
    ]
})
export class AsArrayForm extends AsControlSingleForm<any> implements AsControlValueAccessor, OnInit, OnDestroy {

    form: AsFormArray = inject(AsFormArray)

    el = inject<ElementRef<HTMLFormElement | HTMLFieldSetElement>>(ElementRef<HTMLFormElement | HTMLFieldSetElement>)
        .nativeElement

    constructor() {
        super();
        effect(() => {
            if (this.model()) {
                this.setDisabledState(false)
            } else {
                this.setDisabledState(true)
            }
        });
    }

    ngOnInit(): void {
        let indexOf = this.form.model().indexOf(this.model());
        this.form.addControl(indexOf, this)
    }

    ngOnDestroy(): void {
        let indexOf = this.form.model().indexOf(this.model());
        this.form.removeControl(indexOf, this)
    }


    removeFromArray() {
        let indexOf = this.form.model().indexOf(this.model());
        this.form.removeItem(indexOf)
    }

    writeValue(obj: any): void {
        this.model.set(obj);
    }

    setDisabledState(isDisabled: boolean): void {
        this.el.disabled = isDisabled;
        // this.controls.forEach(control => control.setDisabledState(isDisabled))
    }

    controlAdded(): void {}



}
