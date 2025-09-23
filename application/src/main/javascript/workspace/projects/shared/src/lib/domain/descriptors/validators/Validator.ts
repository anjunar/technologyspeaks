import {AsControl} from "../../../directives/as-control";

export default interface Validator {

    validate(control : AsControl) : boolean

}