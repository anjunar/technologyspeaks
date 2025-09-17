import {Component, inject, ViewEncapsulation} from '@angular/core';
import {WindowManagerService} from "../../modal/as-window/service/window-manager-service";
import {AsWindow} from "../../modal/as-window/as-window";

@Component({
    selector: 'as-view-port',
    imports: [
        AsWindow
    ],
    templateUrl: './as-view-port.html',
    styleUrl: './as-view-port.css',
    encapsulation: ViewEncapsulation.None
})
export class AsViewPort {

    private manager = inject(WindowManagerService);

    windows = this.manager.windows;

}
