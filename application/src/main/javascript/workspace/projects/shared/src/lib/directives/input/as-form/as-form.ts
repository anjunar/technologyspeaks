import {Directive, effect, ElementRef, forwardRef, inject, input, model} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR, ValidationErrors} from "@angular/forms";
import {AsControl} from "../../as-control";

@Directive({
    selector: 'form[asModel], fieldset',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: AsForm,
            multi: true,
        },
        {
            provide: AsControl,
            useExisting: forwardRef(() => AsForm)
        }
    ]
})
export class AsForm extends AsControl {

    onChange: ((value: any) => void)[] = []
    onTouched: (() => void)[] = []

    asModel = model<any>({}, {alias: "asModel"})

    formName = input<string>(null, {alias: "name"})

    asForm = inject(AsForm, {skipSelf: true, optional: true})

    el = inject(ElementRef<HTMLFormElement | HTMLFieldSetElement>).nativeElement

    controls: Map<string, ControlValueAccessor> = new Map()

    constructor() {
        super();
        effect(() => {
            if (this.asForm) {
                this.asForm.addControl(this.formName(), this)
            }
        });
    }

    addControl(name: string, control: ControlValueAccessor) {
        this.controls.set(name, control)
        control.writeValue(this.asModel()[name]())
        control.registerOnChange((val: any) => {
            this.asModel()[name].set(val)
        })
    }

    writeValue(obj: any): void {
        this.asModel.set(obj)
    }

    registerOnChange(fn: any): void {
        this.onChange.push(fn)
    }

    registerOnTouched(fn: any): void {
        this.onTouched.push(fn)
    }

    setDisabledState?(isDisabled: boolean): void {
        this.el.disabled = isDisabled
    }

    get dirty(): boolean {
        return false;
    }

    get errors(): ValidationErrors {
        return undefined;
    }

}
