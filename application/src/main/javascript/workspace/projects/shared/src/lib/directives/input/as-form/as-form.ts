import {Directive, effect, ElementRef, inject, input, model} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Directive({
    selector: 'form[asModel], fieldset[name]',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: AsForm,
            multi: true,
        }
    ]
})
export class AsForm implements ControlValueAccessor {

    onChange: (value: any) => void = () => {};
    onTouched: () => void = () => {};

    value = model<any>({}, {alias : "asModel"})

    name = input<string>()

    form = inject(AsForm, {skipSelf: true, optional: true})

    el = inject(ElementRef<HTMLFormElement | HTMLFieldSetElement>).nativeElement

    controls: Map<string, ControlValueAccessor> = new Map()

    constructor() {
        effect(() => {
            if (this.form) {
                this.form.addControl(this.name(), this)
            }
        });
    }

    addControl(name: string, control: ControlValueAccessor) {
        this.controls.set(name, control)
        control.writeValue(this.value()[name]())
        control.registerOnChange((val: any) => {
            this.value()[name].set(val)
        })
    }

    writeValue(obj: any): void {
        this.value.set(obj)
    }
    registerOnChange(fn: any): void {
        this.onChange = fn
    }
    registerOnTouched(fn: any): void {
        this.onTouched = fn
    }
    setDisabledState?(isDisabled: boolean): void {
        this.el.disabled = isDisabled
    }


}
