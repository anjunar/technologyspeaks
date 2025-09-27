import {Component, input, ViewEncapsulation} from '@angular/core';

@Component({
    selector: 'as-icon',
    imports: [],
    templateUrl: './as-icon.html',
    styleUrl: './as-icon.css',
    encapsulation: ViewEncapsulation.None
})
export class AsIcon {

    value = input.required()

}
