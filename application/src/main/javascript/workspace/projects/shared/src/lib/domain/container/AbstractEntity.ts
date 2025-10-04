import ActiveObject from "./ActiveObject";
import Primitive from "../../mapper/annotations/Primitive";
import {LocalDateTime} from "@js-joda/core";

export default class AbstractEntity extends ActiveObject {

    @Primitive()
    id: string

    @Primitive()
    created: LocalDateTime

    @Primitive()
    modified: LocalDateTime

}