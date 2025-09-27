import {Directive, effect, ElementRef, inject} from '@angular/core';
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {AsControlInput, AsControlValueAccessor} from "../../as-control";

@Directive({
    selector: 'input[property]',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: AsInput,
            multi: true
        }, {
            provide: AsControlInput,
            useExisting: AsInput,
        }
    ]
})
export class AsInput extends AsControlInput implements AsControlValueAccessor {

    el = inject<ElementRef<HTMLInputElement>>(ElementRef<HTMLInputElement>).nativeElement

    constructor() {
        super()
        this.el.addEventListener("input", () => this.onChange.forEach(callback => callback(this.name(), this.el.value, this.el.defaultValue, this.el)))
        this.el.addEventListener("blur", () => this.onTouched.forEach(callback => callback(this.el)))
        this.el.addEventListener("focus", () => this.el.classList.add("focus"))

        effect(() => {
            this.el.name = this.name()
        });

        effect(() => {
            this.writeValue(this.model())
        });
    }

    controlAdded(): void {
    }

    setDisabledState(isDisabled: boolean): void {
        this.el.disabled = isDisabled
    }

    writeValue(obj: any): void {
        if (obj) {
            this.el.value = obj
        } else {
            this.el.value = ""
        }
    }

    writeDefaultValue(obj: any): void {
        if (obj) {
            this.el.defaultValue = obj
        } else {
            this.el.defaultValue = ""
        }
    }

}
