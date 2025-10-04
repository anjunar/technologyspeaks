import {Component, input, ViewEncapsulation} from '@angular/core';
import {BaseCommands} from "./base-commands/base-commands";
import {EditorView} from "prosemirror-view";
import {HeadingCommands} from "./heading-commands/heading-commands";
import {ImageCommands} from "./image-commands/image-commands";
import {LinkCommands} from "./link-commands/link-commands";
import {ListCommands} from "./list-commands/list-commands";

@Component({
    selector: 'editor-toolbar',
    imports: [
        BaseCommands,
        HeadingCommands,
        ImageCommands,
        LinkCommands,
        ListCommands
    ],
    templateUrl: './toolbar.html',
    styleUrl: './toolbar.css',
    encapsulation: ViewEncapsulation.None
})
export class Toolbar {

    editor = input<{view : EditorView}>()

}
