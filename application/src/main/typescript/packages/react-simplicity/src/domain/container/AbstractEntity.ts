import MappedSuperclass from "../../mapper/annotations/MappedSuperclass";
import ActiveObject from "./ActiveObject";
import Basic from "../../mapper/annotations/Basic";
import {LocalDateTime} from "@js-joda/core";

@MappedSuperclass("AbstractEntity")
export default class AbstractEntity extends ActiveObject {

    @Basic()
    id: string

    @Basic()
    created: LocalDateTime

    @Basic()
    modified: LocalDateTime

}