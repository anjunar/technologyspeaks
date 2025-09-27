import Validator from "./Validator";
import Entity from "../../../mapper/annotations/Entity";
import {AsControl, AsControlInput} from "../../../directives/as-control";

@Entity("EmailValidator")
export default class EmailValidator implements Validator<string> {

    validate(control: AsControl<string>): boolean {
        if (control instanceof AsControlInput) {
            let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            return regex.test(control.model())

        } else {
            return false
        }
    }

}