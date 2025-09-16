import {ControlValueAccessor, ValidationErrors} from "@angular/forms";
import {NodeDescriptor, ObjectDescriptor} from "shared";
import {PropertiesContainer} from "../domain/container/ActiveObject";
import PropDescriptor from "../domain/descriptors/PropDescriptor";

export abstract class AsControl  {

    abstract get value(): any

    abstract writeValue(obj: any): void

    abstract get dirty(): boolean

    abstract get pristine(): boolean

    abstract get errors(): ValidationErrors

}

export abstract class AsControlInput extends AsControl implements ControlValueAccessor {
    schema : NodeDescriptor

    instance : PropDescriptor

    abstract writeDefaultValue(obj: any): void

    abstract registerOnTouched(fn: any): void

    abstract registerOnChange(fn: any): void

    abstract unRegisterOnChange(fn: any): void

    abstract setDisabledState?(isDisabled: boolean): void

}

export abstract class AsControlForm extends AsControl {
    schema : ObjectDescriptor

    instance : PropertiesContainer
}
