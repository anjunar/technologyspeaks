import {Component, model, ViewEncapsulation} from '@angular/core';
import User from "../../../domain/control/User";
import {AsForm, AsImage, AsInput, AsInputContainer} from "shared";

@Component({
    selector: 'user-page',
    imports: [AsForm, AsInput, AsInputContainer, AsImage],
    templateUrl: './user-page.html',
    styleUrl: './user-page.css',
    encapsulation: ViewEncapsulation.None
})
export class UserPage {

    user = model<User>()

}
