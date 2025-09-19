import {AbstractControl, ControlValueAccessor, FormControl, FormGroup, FormRecord, NgControl} from "@angular/forms";
import {NodeDescriptor, ObjectDescriptor} from "shared";
import PropDescriptor from "../domain/descriptors/PropDescriptor";

export interface AsControlValueAccessor extends ControlValueAccessor {

    writeDefaultValue(obj: any): void

    unRegisterOnChange(fn: any): void

}

export abstract class AsControl extends NgControl  {

    instance : PropDescriptor

    abstract descriptor : NodeDescriptor

    abstract controlAdded() : void

    abstract override valueAccessor: AsControlValueAccessor

    override viewToModelUpdate(newValue: any): void {
        this.valueAccessor.writeValue(newValue);
    }

}

export abstract class AsControlInput extends AsControl {
    override control: AbstractControl

    override descriptor : NodeDescriptor
    abstract get placeholder() : string
    abstract set placeholder(value : string)
}

export abstract class AsControlForm extends AsControl {
    override control: FormGroup = new FormGroup({})

    override descriptor : ObjectDescriptor
}
