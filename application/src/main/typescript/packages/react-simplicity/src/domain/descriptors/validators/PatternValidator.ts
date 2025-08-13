import Validator from "./Validator";
import Entity from "../../../mapper/annotations/Entity";
import Basic from "../../../mapper/annotations/Basic";

@Entity("PatternValidator")
export default class PatternValidator implements Validator {

    @Basic()
    regexp : String


}