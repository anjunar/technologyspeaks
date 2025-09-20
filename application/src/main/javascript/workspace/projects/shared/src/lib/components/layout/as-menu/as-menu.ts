import {Component, signal, ViewEncapsulation} from '@angular/core';

@Component({
    selector: 'as-menu',
    imports: [],
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
