import Validator from "./Validator";
import Entity from "../../../mapper/annotations/Entity";
import Basic from "../../../mapper/annotations/Basic";
import { AsControl } from "../../../directives/as-control";

@Entity("PatternValidator")
export default class PatternValidator implements Validator<string> {

    @Basic()
    regexp : string

    validate(control: AsControl<string>): boolean {
        let regex = new RegExp(this.regexp, "g")
        return regex.test(control.model())
    }

}