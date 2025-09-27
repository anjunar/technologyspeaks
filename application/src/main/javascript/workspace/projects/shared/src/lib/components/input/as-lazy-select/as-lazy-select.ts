import {Component, ElementRef, inject, model, ModelSignal, ViewEncapsulation} from '@angular/core';
import {AsControlInput, AsControlValueAccessor} from "../../../directives/as-control";
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {value} from "../../../meta-signal/value-signal";
import {AbstractEntity} from "../../../domain/container";

@Component({
    selector: 'as-lazy-select',
    imports: [],
    templateUrl: './as-lazy-select.html',
    styleUrl: './as-lazy-select.css',
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: AsLazySelect,
            multi: true
        }, {
            provide: AsControlInput,
            useExisting: AsLazySelect,
        }
    ]
})
export class AsLazySelect extends AsControlInput<AbstractEntity | AbstractEntity[]> implements AsControlValueAccessor {

    override el: HTMLElement = inject<ElementRef<HTMLElement>>(ElementRef<HTMLElement>)
        .nativeElement

    override model: ModelSignal<AbstractEntity | AbstractEntity[]> = model()

    override default = value<AbstractEntity | AbstractEntity[]>()

    multiselect = model(false)

    disabled = model(false)

    override controlAdded(): void {}

    override setDisabledState(isDisabled: boolean): void {
        this.disabled.set(isDisabled)
        if (isDisabled) {
            this.el.setAttribute("disabled", "true")
        } else {
            this.el.removeAttribute("disabled")
        }
    }

    override writeDefaultValue(obj: any): void {
        if (this.multiselect()) {
            if (obj) {
                this.default.set([...obj])
            } else {
                this.default.set([])
            }
        } else {
            if (obj) {
                this.default.set(obj)
            } else {
                this.default.set(null)
            }
        }
    }

    override writeValue(obj: any): void {
        if (this.multiselect()) {
            if (obj) {
                this.model.set([...obj])
            } else {
                this.model.set([])
            }
        } else {
            if (obj) {
                this.model.set(obj)
            } else {
                this.model.set(null)
            }
        }
    }

}
