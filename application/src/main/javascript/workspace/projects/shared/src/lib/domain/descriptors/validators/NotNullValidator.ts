import Validator from "./Validator";
import Entity from "../../../mapper/annotations/Entity";
import {AsControl} from "../../../directives/as-control";

@Entity("NotNullValidator")
export default class NotNullValidator implements Validator {

    validate(control: AsControl): boolean {
        return !! control.model()
    }

}