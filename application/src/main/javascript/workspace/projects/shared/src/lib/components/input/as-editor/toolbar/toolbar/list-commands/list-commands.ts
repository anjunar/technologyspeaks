import {Component, input, signal, ViewEncapsulation} from '@angular/core';
import {EditorView} from "prosemirror-view";
import {AsIcon} from "../../../../../layout/as-icon/as-icon";
import {NodeSpec, NodeType, Schema} from "prosemirror-model";
import {liftListItem, splitListItem, wrapInList} from "prosemirror-schema-list";
import {EditorCommandComponent} from "../EditorCommandComponent";
import {Command, EditorState, Plugin} from "prosemirror-state";
import {keymap} from "prosemirror-keymap";
import {chainCommands, newlineInCode, splitBlock} from "prosemirror-commands";
import {history} from "prosemirror-history";

@Component({
    selector: 'editor-list-commands',
    imports: [
        AsIcon
    ],
    templateUrl: './list-commands.html',
    styleUrl: './list-commands.css',
    encapsulation: ViewEncapsulation.None,
})
export class ListCommands extends EditorCommandComponent  {

    editor = signal<{view : EditorView}>({view : null})

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

    get nodeSpec(): Record<string, NodeSpec> {
        return {}
    }

    plugins(schema: Schema): Plugin[] {
        function customEnterCommand(listItemType: NodeType): Command {
            return (state, dispatch, view) => {
                const {$from, empty} = state.selection;

                if (empty && $from.parent.content.size === 0) {
                    return liftListItem(listItemType)(state, dispatch);
                }

                return splitListItem(listItemType)(state, dispatch, view);
            };
        }

        return [
            keymap({
                "Enter" : customEnterCommand(schema.nodes["list_item"])
            })
        ];
    }

}
