import { Directive, ElementRef, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {LocalDate, LocalDateTime} from '@js-joda/core';

@Directive({
    selector: 'input[type=date]',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: JodaDateValueAccessor,
            multi: true,
        },
    ],
    host: {
        '(input)': 'onInput($event)',
        '(blur)': 'onTouched()',
    },
})
export class JodaDateValueAccessor implements ControlValueAccessor {

    onChange: (value: LocalDate | null) => void = () => {};
    onTouched: () => void = () => {};

    element: HTMLInputElement = inject(ElementRef<HTMLInputElement>).nativeElement;

    writeValue(value: LocalDate | null): void {
        this.element.value = value ? value.toString() : '';
        if (value) {
            this.element.value = value.toString()
        }
    }

    registerOnChange(fn: (value: LocalDate | null) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.element.disabled = isDisabled;
    }

    onInput(event: Event): void {
        const val = (event.target as HTMLInputElement).value;
        this.onChange(val ? LocalDate.parse(val) : null);
    }
}
