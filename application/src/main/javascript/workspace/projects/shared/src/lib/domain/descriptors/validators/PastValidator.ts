import Validator from "./Validator";
import Entity from "../../../mapper/annotations/Entity";
import {AsControl} from "../../../directives/as-control";
import {LocalDateTime} from "@js-joda/core";

@Entity("PastValidator")
export default class PastValidator implements Validator {

    validate(control: AsControl): boolean {
        return LocalDateTime.now().isBefore(control.model())
    }

}