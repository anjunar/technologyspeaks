import {Directive, effect, ElementRef, inject, input} from '@angular/core';
import {AsForm} from "../as-form/as-form";
import {AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl} from "@angular/forms";

@Directive({
    selector: 'input',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: AsInput,
            multi: true,
        },
    ]
})
export class AsInput extends NgControl implements ControlValueAccessor {

    onChange: (value: any) => void = () => {};
    onTouched: () => void = () => {};
    control : AbstractControl

    el = inject(ElementRef<HTMLInputElement>).nativeElement

    form = inject(AsForm)

    inputName = input<string>("", {alias : "name"})

    constructor() {
        super();
        this.el.addEventListener("input", () => this.onChange(this.el.value))
        this.el.addEventListener("blur", () => this.onTouched())

        effect(() => {
            this.form.addControl(this.inputName(), this)
        })
    }

    registerOnChange(fn: any): void {
        this.onChange = fn
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn
    }

    setDisabledState(isDisabled: boolean): void {
        this.el.disabled = isDisabled
    }

    writeValue(obj: any): void {
        this.el.value = obj ? obj.toString() : '';
        if (obj) {
            this.el.value = obj.toString()
        }
    }

    viewToModelUpdate(newValue: any): void {
        this.writeValue(newValue)
    }

    override valueAccessor: ControlValueAccessor = this

    override name: string = this.inputName()
}
