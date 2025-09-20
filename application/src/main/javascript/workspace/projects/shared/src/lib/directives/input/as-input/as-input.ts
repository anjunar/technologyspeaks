import {Directive, ElementRef, inject, input, OnDestroy, OnInit} from '@angular/core';
import {AsForm} from "../as-form/as-form";
import {AbstractControl, NG_VALUE_ACCESSOR, NgControl, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {AsControl, AsControlInput, AsControlValueAccessor} from "../../as-control";
import {match} from "../../../pattern-match";
import {
    EmailValidator,
    NotBlankValidator,
    NotNullValidator,
    PastValidator,
    SizeValidator
} from "../../../domain/descriptors";

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
export class AsInput extends AsControlInput implements AsControlValueAccessor {

    el = inject<ElementRef<HTMLInputElement>>(ElementRef<HTMLInputElement>).nativeElement

    constructor() {
        super()
        this.el.addEventListener("input", () => {
            this.onChange.forEach(callback => callback(this.inputName(), this.el.value))
            this.control.setValue(this.el.value, { emitEvent: true });
        })
        this.el.addEventListener("blur", () => {
            this.onTouched.forEach(callback => callback())
            this.el.classList.remove("focus")
        })
        this.el.addEventListener("focus", () => this.el.classList.add("focus"))
    }

    get placeholder() {
        return this.el.placeholder
    }

    set placeholder(value: string) {
        this.el.placeholder = value
    }

    controlAdded(): void {
        this.el.type = this.descriptor.widget
        this.placeholder = this.descriptor.title

        this.control.statusChanges.subscribe(status => {
            if (status === "INVALID") {
                this.el.classList.add('invalid');
            } else {
                this.el.classList.remove('invalid');
            }
            if (status === "DISABLED") {
                this.el.classList.add('disabled');
            } else {
                this.el.classList.remove('disabled');
            }
            if (status === "PENDING") {
                this.el.classList.add('pending');
            } else {
                this.el.classList.remove('pending');
            }
            if (status === "VALID") {
                this.el.classList.add("valid")
            } else {
                this.el.classList.remove("valid")
            }

            this.el.classList.toggle('dirty', this.dirty);
        });

        Object.values(this.descriptor.validators || {})
            .forEach((validator) => {
                match(validator)
                    .withObject(EmailValidator, validator => {
                        this.control.addValidators(Validators.email)
                    })
                    .withObject(NotBlankValidator, validator => {
                        this.control.addValidators(Validators.required)
                    })
                    .withObject(NotNullValidator, validator => {
                        this.control.addValidators(Validators.required)
                    })
                    .withObject(PastValidator, validator => {

                    })
                    .withObject(SizeValidator, (validator) => {
                        this.control.addValidators(Validators.minLength(validator.min))
                        this.control.addValidators(Validators.max(validator.max))
                    })
            })

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
        const e: ValidationErrors = {};
        if (this.el.validity.valueMissing) e['required'] = true;
        if (this.el.validity.tooShort) e['minlength'] = { requiredLength: this.el.minLength, actualLength: this.el.value.length };
        if (this.el.validity.tooLong) e['maxlength'] = { requiredLength: this.el.maxLength, actualLength: this.el.value.length };
        if (this.el.validity.typeMismatch) e['email'] = true;

        if (this.control.errors) {
            Object.assign(e, this.control.errors);
        }

        return Object.keys(e).length ? e : null;
    }

    override get path(): string[] | null {
        return this.inputName() ? [this.inputName()] : null;
    }

    override valueAccessor: AsControlValueAccessor = this
}
