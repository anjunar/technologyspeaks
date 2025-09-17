import {Component, effect, inject, model, ViewEncapsulation} from '@angular/core';
import User from "../../../domain/control/User";
import {AsForm, AsInput, AsInputContainer, AsWindow} from "shared";
import {WindowManagerService} from "shared";

@Component({
    selector: 'user-page',
    imports: [AsForm, AsInput, AsInputContainer],
    templateUrl: './user-page.html',
    styleUrl: './user-page.css',
    encapsulation: ViewEncapsulation.None
})
export class UserPage {

    windowService = inject(WindowManagerService)

    user = model<User>()

    openWindow() {
        this.windowService.open({
            id : "test",
            title : "test",
            component : UserPage,
            inputs : {
                user : this.user()
            }
        })
    }

}
