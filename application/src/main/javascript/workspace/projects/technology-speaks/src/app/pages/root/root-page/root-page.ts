import {Component, computed, inject, model, ViewEncapsulation} from '@angular/core';
import {AsDrawer, AsDrawerContainer, AsDrawerContent, AsToolbar, LinkObject} from "shared";
import {ActivatedRoute, RouterLink, RouterOutlet} from "@angular/router";
import Application from "../../../domain/Application";

@Component({
    selector: 'app-root-page',
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

    route = inject(ActivatedRoute);

    open = model(true)

    links = computed(() => {
        let application = this.route.snapshot.data['application'] as Application;
        return Object.values(application.$links)
    });

}
