import { Directive, ElementRef, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LocalDateTime } from '@js-joda/core';

@Directive({
    selector: 'input[type=datetime-local]',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: JodaDateTimeValueAccessor,
            multi: true,
        },
    ],
    host: {
        '(input)': 'onInput($event)',
        '(blur)': 'onTouched()',
    },
})
export class JodaDateTimeValueAccessor implements ControlValueAccessor {

    onChange: (value: LocalDateTime | null) => void = () => {};
    onTouched: () => void = () => {};

    element: HTMLInputElement = inject(ElementRef<HTMLInputElement>).nativeElement;

    writeValue(value: LocalDateTime | null): void {
        this.element.value = value ? value.toString() : '';
        if (value) {
            this.element.value = value.toString().slice(0, 16);
        }
    }

    registerOnChange(fn: (value: LocalDateTime | null) => void): void {
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
        this.onChange(val ? LocalDateTime.parse(val) : null);
    }
}
