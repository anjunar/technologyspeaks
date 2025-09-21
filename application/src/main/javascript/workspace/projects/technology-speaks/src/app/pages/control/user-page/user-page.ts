import {Component, model, ViewEncapsulation} from '@angular/core';
import User from "../../../domain/control/User";
import {
    AsArrayForm,
    AsForm,
    AsFormArray,
    AsIcon,
    AsImage,
    AsInput,
    AsInputContainer,
    AsResponse,
    AsSubmit
} from "shared";
import EMail from "../../../domain/control/EMail";
import UserInfo from "../../../domain/control/UserInfo";
import Address from "../../../domain/control/Address";

@Component({
    selector: 'user-page',
    imports: [AsForm, AsInput, AsSubmit, AsInputContainer, AsImage, AsFormArray, AsArrayForm, AsIcon],
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
    protected readonly UserInfo = UserInfo;
    protected readonly Address = Address;
}
