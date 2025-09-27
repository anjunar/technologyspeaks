import {AsControl} from "../../../directives/as-control";

export default interface Validator<E> {

    validate(control : AsControl<E>) : boolean

}

export class ServerValidator implements Validator<any> {

    constructor(message: string) {
        this.message = message;
    }

    validate(control: AsControl<any>): boolean {
        return false;
    }

    message : string

}