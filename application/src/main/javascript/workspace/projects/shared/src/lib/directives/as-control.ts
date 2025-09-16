import {ControlValueAccessor, ValidationErrors} from "@angular/forms";

export abstract class AsControl implements ControlValueAccessor {

    abstract get value() : any
    abstract writeValue(obj: any): void
    abstract writeDefaultValue(obj: any): void
    abstract registerOnTouched(fn: any): void
    abstract registerOnChange(fn: any): void
    abstract unRegisterOnChange(fn: any): void
    abstract setDisabledState?(isDisabled: boolean): void

    abstract get dirty() : boolean
    abstract get pristine() : boolean

    abstract get errors() : ValidationErrors


}
