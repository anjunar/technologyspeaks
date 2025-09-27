import {Component, model, ViewEncapsulation} from '@angular/core';
import ManagedProperty from "../../../../domain/shared/ManagedProperty";
import {AsForm, AsInputContainer, AsLazySelect, AsSubmit, PropertyFormsModule} from "shared";
import User from "../../../../domain/control/User";
import {UserPipe} from "../../../../pipes/control/user/user-pipe";

@Component({
    selector: 'app-secured-form',
    imports: [
        AsInputContainer, AsLazySelect, UserPipe, PropertyFormsModule, AsForm
    ],
    templateUrl: './secured-form.html',
    styleUrl: './secured-form.css',
    encapsulation: ViewEncapsulation.None
})
export class SecuredForm {

    form = model<ManagedProperty>()

    protected readonly model = model;
    protected readonly User = User;
}
