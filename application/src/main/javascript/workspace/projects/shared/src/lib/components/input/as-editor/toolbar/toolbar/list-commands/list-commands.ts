import {Component, input, ViewEncapsulation} from '@angular/core';
import {EditorView} from "prosemirror-view";
import {AsIcon} from "../../../../../layout/as-icon/as-icon";
import {NodeType} from "prosemirror-model";
import {wrapInList} from "prosemirror-schema-list";

@Component({
    selector: 'editor-list-commands',
    imports: [
        AsIcon
    ],
    templateUrl: './list-commands.html',
    styleUrl: './list-commands.css',
    encapsulation: ViewEncapsulation.None,
})
export class ListCommands {

    editor = input<{ view: EditorView }>()

    wrapBulletList() {
        const view = this.editor()?.view;
        if (!view) return;

        const {state, dispatch} = view;
        const nodeType: NodeType = state.schema.nodes["bullet_list"];
        if (!nodeType) {
            console.warn("bullet_list node type not found in schema.");
            return;
        }

        wrapInList(nodeType)(state, dispatch);
        view.focus();
    }

    wrapOrderedList() {
        const view = this.editor()?.view;
        if (!view) return;

        const {state, dispatch} = view;
        const nodeType: NodeType = state.schema.nodes["ordered_list"];
        if (!nodeType) {
            console.warn("ordered_list node type not found in schema.");
            return;
        }

        wrapInList(nodeType)(state, dispatch);
        view.focus();
    }

}
