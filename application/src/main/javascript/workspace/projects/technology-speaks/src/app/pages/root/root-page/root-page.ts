import {Component, computed, input, signal, ViewEncapsulation} from '@angular/core';
import {AsDrawer, AsDrawerContainer, AsDrawerContent, AsToolbar, AsViewPort} from "shared";
import {RouterLink, RouterOutlet} from "@angular/router";
import Application from "../../../domain/Application";

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

    application = input.required<Application>();

    open = signal(true)

    links = computed(() => this.application().$meta.links);

}
