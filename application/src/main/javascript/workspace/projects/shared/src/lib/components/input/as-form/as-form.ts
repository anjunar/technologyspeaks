import {Directive, input} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {ActiveObject} from "shared";

@Directive({
    selector: 'form[model]',
    host: {
        '[formGroup]': 'form'
    }
})
export class AsForm {

    model = input.required<ActiveObject>()

    form : FormGroup

}
