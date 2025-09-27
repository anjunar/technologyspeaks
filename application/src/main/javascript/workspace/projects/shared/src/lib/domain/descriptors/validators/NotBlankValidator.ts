import Validator from "./Validator";
import Entity from "../../../mapper/annotations/Entity";
import {AsControl} from "../../../directives/as-control";

@Entity("NotBlankValidator")
export default class NotBlankValidator implements Validator<string> {

    validate(control: AsControl<string>): boolean {
        return !! control.model()
    }

}