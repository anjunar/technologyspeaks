import Validator from "./Validator";
import Entity from "../../../mapper/annotations/Entity";
import Primitive from "../../../mapper/annotations/Primitive";
import { AsControl } from "../../../directives/as-control";

@Entity("PatternValidator")
export default class PatternValidator implements Validator<string> {

    @Primitive()
    regexp : string

    constructor(regexp: string) {
        this.regexp = regexp;
    }

    validate(control: AsControl<string>): boolean {
        let regex = new RegExp(this.regexp, "g")
        return regex.test(control.model())
    }

}