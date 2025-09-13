import Validator from "./Validator";
import Entity from "../../../mapper/annotations/Entity";
import Basic from "../../../mapper/annotations/Basic";

@Entity("SizeValidator")
export default class SizeValidator implements Validator {

    @Basic()
    min : number

    @Basic()
    max : number

}