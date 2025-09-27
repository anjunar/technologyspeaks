import {Component, inject, OnDestroy, OnInit, PLATFORM_ID, signal, ViewEncapsulation} from '@angular/core';
import {AsIcon} from "../as-icon/as-icon";
import {isPlatformBrowser} from "@angular/common";

@Component({
    selector: 'as-menu',
    imports: [
        AsIcon
    ],
    templateUrl: './as-menu.html',
    styleUrl: './as-menu.css',
    encapsulation: ViewEncapsulation.None
})
export class AsMenu implements OnInit, OnDestroy {

    platformId = inject(PLATFORM_ID);

    listener = () => this.open.set(false);

    open = signal(false)

    toggle(event: MouseEvent): void {
        event.stopPropagation();
        this.open.update(v => !v);
    }

    onMenuClick(event: MouseEvent): void {
        event.stopPropagation();
    }

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            window.addEventListener("click", this.listener);
        }
    }

    ngOnDestroy(): void {
        if (isPlatformBrowser(this.platformId)) {
            window.removeEventListener("click", this.listener);
        }
    }

}
