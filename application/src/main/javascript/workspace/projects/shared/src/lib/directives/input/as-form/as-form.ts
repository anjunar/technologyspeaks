import {Directive, effect, ElementRef, inject, input, model, OnDestroy, OnInit} from '@angular/core';
import {NG_VALUE_ACCESSOR, ValidationErrors} from "@angular/forms";
import {AsControl, AsControlForm, AsControlInput} from "../../as-control";
import {ObjectDescriptor} from "../../../domain/descriptors";
import PropDescriptor from "../../../domain/descriptors/PropDescriptor";
import {AsInput} from "../as-input/as-input";
import {PropertiesContainer} from "../../../domain/container/ActiveObject";

@Directive({
    selector: 'form[asModel], fieldset',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: AsForm,
            multi: true,
        },
        {
            provide: AsControlForm,
            useExisting: AsForm,
            multi: true
        }
    ]
})
export class AsForm extends AsControlForm implements OnInit, OnDestroy {

    onChangeListener = (name : string, val: any) => {
        this.model()[name].set(val)
    };

    model = model<any>({}, {alias: "asModel"})

    name = input<string>(null, {alias: "name"})

    form = inject(AsForm, {skipSelf: true, optional: true})

    controls: Map<string, AsControl> = new Map()

    ngOnInit(): void {
        if (this.form) {
            this.form.addControl(this.name(), this)
        } else {
            this.schema = this.model().$meta.descriptors
            this.instance = this.model().$meta.instance
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
        control.writeValue(value)

        if (control instanceof AsControlForm) {
            control.schema = this.schema.properties[name] as ObjectDescriptor
            control.instance = this.model().$meta.instance
        }

        if (control instanceof AsControlInput) {
            control.registerOnChange(this.onChangeListener)
            control.writeDefaultValue(value)
            control.schema = this.schema.properties[name]
            control.instance = this.model().$meta.instance[name]
        }
    }

    removeControl(name : string) {
        let control = this.controls.get(name);
        if (control instanceof AsControlInput) {
            control.unRegisterOnChange(this.onChangeListener)
        }
        this.controls.delete(name)
    }

    get value(): any {
        return this.model()
    }

    writeValue(obj: any): void {
        this.model.set(obj)
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
