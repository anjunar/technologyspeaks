import {Directive, effect, ElementRef, inject, input} from '@angular/core';
import {AsForm} from "../as-form/as-form";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

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
export class AsInput implements ControlValueAccessor {

    onChange: (value: any) => void = () => {};
    onTouched: () => void = () => {};

    el = inject(ElementRef<HTMLInputElement>).nativeElement

    form = inject(AsForm)

    name = input.required<string>()

    constructor() {
        this.el.addEventListener("input", () => this.onChange(this.el.value))
        this.el.addEventListener("blur", () => this.onTouched())

        effect(() => {
            this.form.addControl(this.name(), this)
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

}
