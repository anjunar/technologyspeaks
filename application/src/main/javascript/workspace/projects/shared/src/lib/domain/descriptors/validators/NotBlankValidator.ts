import Validator from "./Validator";
import Entity from "../../../mapper/annotations/Entity";
import {AsControl} from "../../../directives/as-control";

@Entity("NotBlankValidator")
export default class NotBlankValidator implements Validator {

    validate(control: AsControl): boolean {
        return !! control.model()
    }

}