import {Component, effect, model} from '@angular/core';
import User from "../../../domain/control/User";
import {JsonPipe} from "@angular/common";
import {AsForm, AsInput, AsInputContainer} from "shared";

@Component({
    selector: 'user-page',
    imports: [JsonPipe, AsForm, AsInput, AsInputContainer],
    templateUrl: './user-page.html',
    styleUrl: './user-page.css'
})
export class UserPage {

    user = model<User>()


    constructor() {
        effect(() => {
            console.log(this.user())
        });
    }
}
