import {Directive, effect, ElementRef, inject, input, model, OnDestroy, OnInit} from '@angular/core';
import {NG_VALUE_ACCESSOR, ValidationErrors} from "@angular/forms";
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
            useExisting: AsForm,
            multi: true
        }
    ]
})
export class AsForm extends AsControl implements OnInit, OnDestroy {

    onChange: ((name : string, value: any) => void)[] = []
    onTouched: (() => void)[] = []

    onChangeListener = (name : string, val: any) => {
        this.model()[name].set(val)
    };

    model = model<any>({}, {alias: "asModel"})

    name = input<string>(null, {alias: "name"})

    form = inject(AsForm, {skipSelf: true, optional: true})

    el = inject(ElementRef<HTMLFormElement | HTMLFieldSetElement>).nativeElement

    controls: Map<string, AsControl> = new Map()

    ngOnInit(): void {
        if (this.form) {
            this.form.addControl(this.name(), this)
        }
    }

    ngOnDestroy(): void {
        if (this.form) {
            this.form.removeControl(this.name())
        }
    }

    addControl(name: string, control: AsControl) {
        this.controls.set(name, control)
        let value = this.model()[name]();
        control.writeDefaultValue(value)
        control.writeValue(value)
        control.registerOnChange(this.onChangeListener)
    }

    removeControl(name : string) {
        let control = this.controls.get(name);
        control.unRegisterOnChange(this.onChangeListener)
        this.controls.delete(name)
    }

    get value(): any {
        return this.model()
    }

    writeValue(obj: any): void {
        this.model.set(obj)
    }

    writeDefaultValue(obj: any): void {
    }

    registerOnChange(fn: any): void {
        this.onChange.push(fn)
    }

    unRegisterOnChange(fn: any): void {
        let indexOf = this.onChange.indexOf(fn);
        this.onChange.splice(indexOf, 1)
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

    get pristine(): boolean {
        return false;
    }

    get errors(): ValidationErrors {
        return undefined;
    }

}
