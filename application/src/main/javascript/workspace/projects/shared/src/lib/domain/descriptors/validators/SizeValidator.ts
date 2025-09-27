import Validator from "./Validator";
import Entity from "../../../mapper/annotations/Entity";
import Basic from "../../../mapper/annotations/Basic";
import {AsControl, AsControlInput} from "../../../directives/as-control";

@Entity("SizeValidator")
export default class SizeValidator implements Validator<string> {

    @Basic()
    min : number

    @Basic()
    max : number

    validate(control: AsControl<string>): boolean {
        if (control instanceof AsControlInput) {
            return control.model().length > this.min && control.model().length < this.max
        } else {
            return false
        }
    }

}