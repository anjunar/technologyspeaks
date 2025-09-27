import {Component, model, ViewEncapsulation} from '@angular/core';
import User from "../../../domain/control/User";
import {
    AsArrayForm,
    AsForm,
    AsFormArray, AsIcon,
    AsImage, AsInput,
    AsInputContainer,
    AsMenu,
    AsResponse, AsSubmit,
    PropertyFormsModule
} from "shared";
import {SecuredProperty} from "../../../components/security/secured-property/secured-property";

@Component({
    selector: 'user-page',
    imports: [AsInputContainer, AsImage, AsMenu, SecuredProperty, PropertyFormsModule, AsForm, AsFormArray, AsArrayForm, AsInput, AsIcon, AsSubmit],
    templateUrl: './user-page.html',
    styleUrl: './user-page.css',
    encapsulation: ViewEncapsulation.None
})
export class UserPage {

    user = model<User>()

    onSubmit(response: AsResponse<User>) {

        console.log(response)

    }

}
