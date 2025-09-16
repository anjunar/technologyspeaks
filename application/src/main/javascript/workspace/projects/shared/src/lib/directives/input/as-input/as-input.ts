import {Directive, effect, ElementRef, forwardRef, inject, input} from '@angular/core';
import {AsForm} from "../as-form/as-form";
import {NG_VALUE_ACCESSOR, ValidationErrors} from "@angular/forms";
import {AsControl} from "../../as-control";

@Directive({
    selector: 'input',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: AsInput,
            multi: true,
        },
        {
            provide: AsControl,
            useExisting: forwardRef(() => AsInput)
        }
    ]
})
export class AsInput extends AsControl {

    onChange: ((value: any) => void)[] = []
    onTouched: (() => void)[] = []

    el = inject(ElementRef<HTMLInputElement>).nativeElement

    form = inject(AsForm)

    inputName = input<string>("", {alias: "name"})

    constructor() {
        super()
        this.el.addEventListener("input", () => this.onChange.forEach(callback => callback((this.el.value))))
        this.el.addEventListener("blur", () => this.onTouched.forEach(callback => callback()))

        effect(() => {
            this.form.addControl(this.inputName(), this)
        })
    }

    registerOnChange(fn: any): void {
        this.onChange.push(fn)
    }

    registerOnTouched(fn: any): void {
        this.onTouched.push(fn)
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

    get dirty(): boolean {
        return false;
    }

    get errors(): ValidationErrors {
        return undefined;
    }

}
