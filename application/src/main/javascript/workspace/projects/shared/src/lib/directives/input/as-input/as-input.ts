import {Directive, ElementRef, inject, input, OnDestroy, OnInit} from '@angular/core';
import {AsForm} from "../as-form/as-form";
import {NG_VALUE_ACCESSOR, ValidationErrors} from "@angular/forms";
import {AsControl} from "../../as-control";

@Directive({
    selector: 'input',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: AsInput,
            multi: true
        },
        {
            provide: AsControl,
            useExisting: AsInput,
            multi: true
        }
    ]
})
export class AsInput extends AsControl implements OnInit, OnDestroy {

    onChange: ((name : string, value: any) => void)[] = []
    onTouched: (() => void)[] = []

    el = inject(ElementRef<HTMLInputElement>).nativeElement

    form = inject(AsForm)

    name = input<string>("", {alias: "name"})

    constructor() {
        super()
        this.el.addEventListener("input", () => this.onChange.forEach(callback => callback(this.name(), this.el.value)))
        this.el.addEventListener("blur", () => this.onTouched.forEach(callback => callback()))
    }

    ngOnInit(): void {
        this.form.addControl(this.name(), this)
    }

    ngOnDestroy(): void {
        this.form.removeControl(this.name())
    }

    registerOnChange(fn: any): void {
        this.onChange.push(fn)
    }

    unRegisterOnChange(fn: any): void {
        let indexOf = this.onChange.indexOf(fn);
        this.onChange.splice(indexOf, 1)
    }

    registerOnTouched(fn: any): void {
        this.onTouched.push(fn)
    }

    setDisabledState(isDisabled: boolean): void {
        this.el.disabled = isDisabled
    }

    get value(): any {
        return this.el.value
    }

    writeValue(obj: any): void {
        if (obj) {
            this.el.value = obj
        } else {
            this.el.value = null
        }
    }

    writeDefaultValue(obj: any): void {
        if (obj) {
            this.el.defaultValue = obj
        } else {
            this.el.defaultValue = null
        }
    }

    get pristine(): boolean {
        return this.el.value === this.el.defaultValue
    }

    get dirty(): boolean {
        return !this.pristine
    }

    get errors(): ValidationErrors {
        return this.el.validity
    }

}
