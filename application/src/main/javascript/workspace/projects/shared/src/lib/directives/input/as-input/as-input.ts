import {Directive, ElementRef, inject, input, OnDestroy, OnInit} from '@angular/core';
import {AsForm} from "../as-form/as-form";
import {NG_VALUE_ACCESSOR, NgControl, ValidationErrors} from "@angular/forms";
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
            provide: NgControl,
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

    inputName = input<string>("", {alias: "name"})

    constructor() {
        super()
        this.el.addEventListener("input", () => this.onChange.forEach(callback => callback(this.inputName(), this.el.value)))
        this.el.addEventListener("blur", () => this.onTouched.forEach(callback => callback()))
    }

    set type(value: string) {
        this.el.type = value
    }

    ngOnInit(): void {
        this.form.addControl(this.inputName(), this)
    }

    ngOnDestroy(): void {
        this.form.removeControl(this.inputName())
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

    override get value(): any {
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

    override get pristine(): boolean {
        return this.el.value === this.el.defaultValue
    }

    override get dirty(): boolean {
        return !this.pristine
    }

    override get errors(): ValidationErrors {
        return this.el.validity
    }

    viewToModelUpdate(newValue: any): void {
        this.writeValue(newValue)
    }



}
