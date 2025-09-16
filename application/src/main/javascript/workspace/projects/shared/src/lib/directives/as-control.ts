import {ControlValueAccessor, ValidationErrors} from "@angular/forms";

export abstract class AsControl implements ControlValueAccessor {

    abstract writeValue(obj: any): void
    abstract registerOnTouched(fn: any): void
    abstract setDisabledState?(isDisabled: boolean): void

    abstract get dirty() : boolean

    abstract get errors() : ValidationErrors

    abstract registerOnChange(fn: any): void


}
