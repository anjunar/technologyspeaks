import {Directive, effect, ElementRef, inject, ModelSignal, model} from '@angular/core';
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {AsControlInput, AsControlValueAccessor} from "../../as-control";
import {LocalDate, LocalDateTime} from "@js-joda/core";

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
export class AsInput extends AsControlInput<string | number | LocalDate | LocalDateTime>  {

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
            let model = this.model() as string;
            if (model) {
                this.el.value = model
            } else {
                this.el.value = ""
            }
        });

        effect(() => {
            let model = this.model() as string;
            if (model) {
                this.el.defaultValue = model
            } else {
                this.el.defaultValue = ""
            }
        });

    }

    controlAdded(): void {
    }

    setDisabledState(isDisabled: boolean): void {
        this.el.disabled = isDisabled
    }

}
