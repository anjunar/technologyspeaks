import {Component, signal, ViewEncapsulation} from '@angular/core';
import {AsIcon} from "../as-icon/as-icon";

@Component({
    selector: 'as-menu',
    imports: [
        AsIcon
    ],
    templateUrl: './as-menu.html',
    styleUrl: './as-menu.css',
    encapsulation: ViewEncapsulation.None
})
export class AsMenu {

    open = signal(false)

    toggle(): void {
        this.open.update(v => !v);
    }

}
