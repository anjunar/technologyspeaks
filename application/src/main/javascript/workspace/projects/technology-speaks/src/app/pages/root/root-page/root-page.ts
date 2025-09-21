import {Component, computed, inject, input, signal, ViewEncapsulation} from '@angular/core';
import {AsDrawer, AsDrawerContainer, AsDrawerContent, AsToolbar, AsViewPort} from "shared";
import {RouterLink, RouterOutlet} from "@angular/router";
import Application from "../../../domain/Application";
import {AppService} from "../../../app.service";

@Component({
    selector: 'root-page',
    imports: [
        AsDrawer,
        AsDrawerContainer,
        AsDrawerContent,
        AsToolbar,
        RouterOutlet,
        RouterLink,
        AsViewPort
    ],
    templateUrl: './root-page.html',
    styleUrl: './root-page.css',
    encapsulation: ViewEncapsulation.None
})
export class RootPage {

    application = inject(AppService)

    open = signal(true)

    links = computed(() => this.application.app().$meta.links);

}
