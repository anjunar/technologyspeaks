import {Component, input, model, ViewEncapsulation} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {LinkCommands} from "../link-commands";

@Component({
    selector: 'editor-link-window',
    imports: [
        FormsModule
    ],
    templateUrl: './link-window.html',
    styleUrl: './link-window.css',
    encapsulation: ViewEncapsulation.None
})
export class LinkWindow {

    parent = input.required<LinkCommands>()

    url = model<string>("http://example.com")

}
