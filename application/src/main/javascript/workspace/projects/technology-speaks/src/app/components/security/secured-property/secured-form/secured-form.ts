import {Component, model, ViewEncapsulation} from '@angular/core';
import ManagedProperty from "../../../../domain/shared/ManagedProperty";
import {AsForm, AsInput, AsInputContainer, AsLazySelect, PropertyFormsModule} from "shared";
import {UserPipe} from "../../../../pipes/control/user/user-pipe";

@Component({
    selector: 'secured-form',
    imports: [
        AsInputContainer, AsInput, AsLazySelect, UserPipe, PropertyFormsModule, AsForm
    ],
    templateUrl: './secured-form.html',
    styleUrl: './secured-form.css',
    encapsulation: ViewEncapsulation.None
})
export class SecuredForm {

    form = model<ManagedProperty>()

}
