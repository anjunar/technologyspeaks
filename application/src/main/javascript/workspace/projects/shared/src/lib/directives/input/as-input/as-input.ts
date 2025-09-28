import {Directive, effect, ElementRef, inject, model} from '@angular/core';
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {AsControlInput} from "../../as-control";
import {LocalDate, LocalDateTime} from "@js-joda/core";

export interface ModelConverter<M, V> {
    toView(model: M | null | undefined): V;

    fromView(view: V): M | null;
}

class StringConverter implements ModelConverter<string, string> {
    toView(model: string | null): string {
        return model ?? '';
    }

    fromView(view: string): string {
        return view;
    }
}

class NumberConverter implements ModelConverter<number, string> {
    toView(model: number | null): string {
        return model?.toString() ?? '';
    }

    fromView(view: string): number | null {
        return view ? Number(view) : null;
    }
}

class LocalDateConverter implements ModelConverter<LocalDate, string> {
    toView(model: LocalDate | null): string {
        return model ? model.toString() : '';
    }

    fromView(view: string): LocalDate | null {
        return view ? LocalDate.parse(view) : null;
    }
}

class LocalDateTimeConverter implements ModelConverter<LocalDateTime, string> {
    toView(model: LocalDateTime | null): string {
        return model ? model.toString() : '';
    }

    fromView(view: string): LocalDateTime | null {
        return view ? LocalDateTime.parse(view) : null;
    }
}

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
export class AsInput extends AsControlInput<string | number | LocalDate | LocalDateTime> {

    el = inject<ElementRef<HTMLInputElement>>(ElementRef<HTMLInputElement>).nativeElement

    type = model("text")

    converter: ModelConverter<any, any>

    constructor() {
        super()
        this.el.addEventListener("input", () => this.onChange.forEach(callback => callback(this.name(), this.converter.fromView(this.el.value), this.converter.fromView(this.el.defaultValue), this.el)))
        this.el.addEventListener("blur", () => this.onTouched.forEach(callback => callback(this.el)))
        this.el.addEventListener("focus", () => this.el.classList.add("focus"))


        effect(() => {
            let type = this.type();
            this.el.type = type
            switch (type) {
                case "text" :
                    this.converter = new StringConverter()
                    break
                case "number" :
                    this.converter = new NumberConverter()
                    break
                case "date" :
                    this.converter = new LocalDateConverter()
                    break
                case "datetime-local" :
                    this.converter = new LocalDateTimeConverter()
                    break
                default :
                    this.converter = new StringConverter()
            }
        });

        effect(() => {
            this.el.name = this.name()
        });

        effect(() => {
            let model = this.model() as string;
            this.el.value = this.converter.toView(model)
        });

        effect(() => {
            let model = this.default() as string;
            this.el.defaultValue = this.converter.toView(model)
        });

    }

    controlAdded(): void {
    }

    setDisabledState(isDisabled: boolean): void {
        this.el.disabled = isDisabled
    }

}
