import {Directive, ElementRef, inject, input, model, OnDestroy, OnInit} from '@angular/core';
import {NG_VALUE_ACCESSOR, NgControl, ValidationErrors} from "@angular/forms";
import {AsControl} from "../../as-control";
import {MetaSignal} from "../../../meta-signal/meta-signal";

@Directive({
    selector: 'form[asModel], fieldset',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: AsForm,
            multi: true,
        },
        {
            provide: NgControl,
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

    formName = input<string>(null, {alias: "name"})

    form = inject(AsForm, {skipSelf: true, optional: true})

    el = inject(ElementRef<HTMLFormElement | HTMLFieldSetElement>).nativeElement

    controls: Map<string, AsControl> = new Map()

    set type(value: string) {}

    ngOnInit(): void {
        if (this.form) {
            this.form.addControl(this.formName(), this)
        }
    }

    ngOnDestroy(): void {
        if (this.form) {
            this.form.removeControl(this.formName())
        }
    }

    addControl(name: string, control: AsControl) {
        this.controls.set(name, control)
        let metaSignal : MetaSignal<any> = this.model()[name];
        let value = metaSignal();
        control.writeValue(value)
        control.type = metaSignal.descriptor.widget
    }

    removeControl(name : string) {
        let control = this.controls.get(name);
        control.unRegisterOnChange(this.onChangeListener)
        this.controls.delete(name)
    }

    override get value(): any {
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

    override get dirty(): boolean {
        return false;
    }

    override get pristine(): boolean {
        return false;
    }

    override get errors(): ValidationErrors {
        return undefined;
    }

    viewToModelUpdate(newValue: any): void {
        this.writeValue(newValue)
    }

}
