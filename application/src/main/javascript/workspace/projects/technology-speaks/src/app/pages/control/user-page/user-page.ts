import {Component, effect, model, ViewEncapsulation} from '@angular/core';
import User from "../../../domain/control/User";
import {AsIcon, AsImage, AsInputContainer, AsMenu, AsResponse, configuredPropertyForms} from "shared";
import {SecuredProperty} from "../../../components/security/secured-property/secured-property";

@Component({
    selector: 'user-page',
    imports: [AsInputContainer, AsImage, AsMenu, SecuredProperty, AsIcon, ...configuredPropertyForms],
    templateUrl: './user-page.html',
    styleUrl: './user-page.css',
    encapsulation: ViewEncapsulation.None
})
export class UserPage {

    user = model<User>()

    constructor() {
        effect(() => {
            console.log(this.user())
        });
    }

    onSubmit(response: AsResponse<User>) {

        console.log(response)

    }

}
