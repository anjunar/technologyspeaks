import {AsControl} from "../../../directives/as-control";

export default interface Validator {

    validate(control : AsControl) : boolean

}

export class ServerValidator implements Validator {

    constructor(message: string) {
        this.message = message;
    }

    validate(control: AsControl): boolean {
        return false;
    }

    message : string

}