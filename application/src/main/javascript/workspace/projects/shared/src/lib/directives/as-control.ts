import {AbstractControl, ControlValueAccessor, FormControl, FormGroup, FormRecord, NgControl} from "@angular/forms";
import {AsForm, NodeDescriptor, ObjectDescriptor} from "shared";
import PropDescriptor from "../domain/descriptors/PropDescriptor";
import {AfterViewInit, Directive, ElementRef, inject, input, InputSignal, OnDestroy, OnInit} from "@angular/core";

export interface AsControlValueAccessor extends ControlValueAccessor {

    writeDefaultValue(obj: any): void

    unRegisterOnChange(fn: any): void

}

export abstract class AsControl extends NgControl  {

    onChange: ((name: string, value: any) => void)[] = []
    onTouched: (() => void)[] = []

    instance : PropDescriptor

    abstract descriptor : NodeDescriptor

    abstract controlAdded() : void

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

    abstract override valueAccessor: AsControlValueAccessor

    override viewToModelUpdate(newValue: any): void {
        this.valueAccessor.writeValue(newValue);
    }

}

@Directive()
export abstract class AsControlInput extends AsControl implements OnInit, OnDestroy {

    inputName = input<string>("", {alias: "name"})

    form = inject(AsForm)

    override control: AbstractControl

    override descriptor : NodeDescriptor
    abstract get placeholder() : string
    abstract set placeholder(value : string)

    ngOnInit(): void {
        this.form.addControl(this.inputName(), this)
    }

    ngOnDestroy(): void {
        this.form.removeControl(this.inputName(), this)
    }

}

export abstract class AsControlForm extends AsControl {
    override control: FormGroup = new FormGroup({})

    override descriptor : ObjectDescriptor
}
