import Validator from "./Validator";
import Entity from "../../../mapper/annotations/Entity";
import {AsControl} from "../../../directives/as-control";
import {LocalDate, LocalDateTime} from "@js-joda/core";

@Entity("PastValidator")
export default class PastValidator implements Validator<LocalDateTime | LocalDate> {

    validate(control: AsControl<LocalDateTime | LocalDate>): boolean {
        let model = control.model();
        if (model instanceof LocalDateTime) {
            return model.isBefore(LocalDateTime.now())
        } else {
            return model.isBefore(LocalDate.now())
        }
    }

}