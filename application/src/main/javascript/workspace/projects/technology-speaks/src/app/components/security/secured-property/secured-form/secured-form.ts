import {Component, model, ViewEncapsulation} from '@angular/core';
import ManagedProperty from "../../../../domain/shared/ManagedProperty";
import {AsInputContainer, AsLazySelect, configuredPropertyForms} from "shared";
import {UserPipe} from "../../../../pipes/control/user/user-pipe";

@Component({
    selector: 'secured-form',
    imports: [
        AsInputContainer, AsLazySelect, UserPipe, ...configuredPropertyForms
    ],
    templateUrl: './secured-form.html',
    styleUrl: './secured-form.css',
    encapsulation: ViewEncapsulation.None
})
export class SecuredForm {

    form = model<ManagedProperty>()

}
