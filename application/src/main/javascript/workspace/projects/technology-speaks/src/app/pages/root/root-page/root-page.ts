import {Component, computed, inject, input, model, OnInit, signal, ViewEncapsulation} from '@angular/core';
import {AsDrawer, AsDrawerContainer, AsDrawerContent, AsToolbar, LinkContainerObject, LinkObject} from "shared";
import {ActivatedRoute, RouterLink, RouterOutlet} from "@angular/router";
import Application from "../../../domain/Application";

@Component({
    selector: 'root-page',
    imports: [
        AsDrawer,
        AsDrawerContainer,
        AsDrawerContent,
        AsToolbar,
        RouterOutlet,
        RouterLink
    ],
    templateUrl: './root-page.html',
    styleUrl: './root-page.css',
    encapsulation: ViewEncapsulation.None
})
export class RootPage {

    application = input.required<Application>();

    open = signal(true)

    links = computed(() => this.application().$links);

}
