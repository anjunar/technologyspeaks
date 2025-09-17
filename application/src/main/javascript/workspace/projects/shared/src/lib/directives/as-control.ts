import {AbstractControl, ControlValueAccessor, NgControl} from "@angular/forms";

export abstract class AsControl extends NgControl implements ControlValueAccessor {

    override control: AbstractControl

    abstract set type(value: string)

    abstract writeValue(obj: any): void

    abstract writeDefaultValue(obj: any): void

    abstract registerOnTouched(fn: any): void

    abstract registerOnChange(fn: any): void

    abstract unRegisterOnChange(fn: any): void

    abstract setDisabledState?(isDisabled: boolean): void

    override valueAccessor: ControlValueAccessor = this

}