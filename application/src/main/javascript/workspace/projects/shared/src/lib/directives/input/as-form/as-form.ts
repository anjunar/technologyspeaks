import {Directive, effect, ElementRef, inject, input, model} from '@angular/core';
import {AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl} from "@angular/forms";

@Directive({
    selector: 'form[asModel], fieldset',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: AsForm,
            multi: true,
        }
    ]
})
export class AsForm extends NgControl implements ControlValueAccessor {

    onChange: (value: any) => void = () => {};
    onTouched: () => void = () => {};
    control : AbstractControl

    asModel = model<any>({}, {alias : "asModel"})

    formName = input<string>(null, {alias : "name"})

    asForm = inject(AsForm, {skipSelf: true, optional: true})

    el = inject(ElementRef<HTMLFormElement | HTMLFieldSetElement>).nativeElement

    controls: Map<string, NgControl & ControlValueAccessor> = new Map()

    constructor() {
        super();
        effect(() => {
            if (this.asForm) {
                this.asForm.addControl(this.formName(), this)
            }
        });
    }

    addControl(name: string, control: NgControl & ControlValueAccessor) {
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
        this.onChange = fn
    }
    registerOnTouched(fn: any): void {
        this.onTouched = fn
    }
    setDisabledState?(isDisabled: boolean): void {
        this.el.disabled = isDisabled
    }

    viewToModelUpdate(newValue: any): void {
        this.writeValue(newValue)
    }

    override valueAccessor: ControlValueAccessor = this

    override name: string = this.formName()
}
