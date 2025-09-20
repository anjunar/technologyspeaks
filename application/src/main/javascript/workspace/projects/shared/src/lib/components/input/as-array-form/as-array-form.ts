import {Component, effect, ElementRef, inject, input, model, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {
    AsControl,
    AsControlArrayForm,
    AsControlForm, AsControlInput,
    AsControlSingleForm,
    AsControlValueAccessor
} from "../../../directives/as-control";
import {AsFormArray, MetaSignal} from "shared";
import {NG_VALUE_ACCESSOR, NgControl, ValidationErrors} from "@angular/forms";

@Component({
    selector: 'array-form',
    imports: [],
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
            provide: NgControl,
            useExisting: AsArrayForm,
            multi: true
        },
        {
            provide: AsControlForm,
            useExisting: AsArrayForm
        },
    ]
})
export class AsArrayForm extends AsControlSingleForm implements AsControlValueAccessor, OnInit, OnDestroy {

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

    override get value(): any {
        return this.model();
    }

    writeValue(obj: any): void {
        this.model.set(obj);
    }

    setDisabledState?(isDisabled: boolean): void {
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

    controlAdded(): void {}

    override valueAccessor: AsControlValueAccessor = this;
}

