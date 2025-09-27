import {Component, model, ViewEncapsulation} from '@angular/core';
import ManagedProperty from "../../../../domain/shared/ManagedProperty";
import {AsForm, AsInput, AsInputContainer} from "shared";

@Component({
    selector: 'app-secured-form',
    imports: [
        AsForm, AsInput, AsInputContainer
    ],
    templateUrl: './secured-form.html',
    styleUrl: './secured-form.css',
    encapsulation: ViewEncapsulation.None
})
export class SecuredForm {

    form = model<ManagedProperty>()

    protected readonly model = model;
}
