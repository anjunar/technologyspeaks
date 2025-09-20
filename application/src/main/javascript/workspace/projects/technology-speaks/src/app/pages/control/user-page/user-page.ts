import {Component, model, ViewEncapsulation} from '@angular/core';
import User from "../../../domain/control/User";
import {AsForm, AsFormArray, AsImage, AsInput, AsInputContainer, AsResponse, AsSubmit} from "shared";
import EMail from "../../../domain/control/EMail";

@Component({
    selector: 'user-page',
    imports: [AsForm, AsInput, AsSubmit, AsInputContainer, AsImage, AsFormArray],
    templateUrl: './user-page.html',
    styleUrl: './user-page.css',
    encapsulation: ViewEncapsulation.None
})
export class UserPage {

    user = model<User>()

    onSubmit(response : AsResponse<User>) {

        console.log(response)

    }

    protected readonly EMail = EMail;
}
