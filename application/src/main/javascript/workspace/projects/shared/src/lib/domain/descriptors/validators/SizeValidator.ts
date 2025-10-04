import Validator from "./Validator";
import Entity from "../../../mapper/annotations/Entity";
import Primitive from "../../../mapper/annotations/Primitive";
import {AsControl, AsControlInput} from "../../../directives/as-control";
import {max, min} from "rxjs";

@Entity("SizeValidator")
export default class SizeValidator implements Validator<string> {

    @Primitive()
    min : number

    @Primitive()
    max : number

    constructor(min: number, max: number) {
        this.min = min;
        this.max = max;
    }

    validate(control: AsControl<string>): boolean {
        if (control instanceof AsControlInput) {
            return control.model().length > this.min && control.model().length < this.max
        } else {
            return false
        }
    }

}