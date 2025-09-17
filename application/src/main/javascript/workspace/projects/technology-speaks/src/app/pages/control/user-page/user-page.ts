import {Component, effect, model, ViewEncapsulation} from '@angular/core';
import User from "../../../domain/control/User";
import {AsForm, AsInput, AsInputContainer} from "shared";

@Component({
    selector: 'user-page',
    imports: [AsForm, AsInput, AsInputContainer],
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
}
