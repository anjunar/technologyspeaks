import {Component, computed, signal, ViewEncapsulation} from '@angular/core';
import {EditorView} from "prosemirror-view";
import {redo, undo} from "prosemirror-history";
import {toggleMark} from "prosemirror-commands";
import {AsIcon} from "../../../../../layout/as-icon/as-icon";
import {EditorCommandComponent} from "../EditorCommandComponent";
import {NodeSpec} from "prosemirror-model";


@Component({
    selector: 'editor-base-commands',
    imports: [
        AsIcon
    ],
    templateUrl: './base-commands.html',
    styleUrl: './base-commands.css',
    encapsulation: ViewEncapsulation.None
})
export class BaseCommands extends EditorCommandComponent {

    editor = signal<{ view: EditorView }>({view: null})

    activeMarks = computed(() => {
        const {state} = this.editor().view;
        const marks = state.schema.marks;
        const result: Record<string, boolean> = {};
        for (const markName in marks) {
            result[markName] = this.isMarkActive(markName);
        }
        return result;
    });

    toggleMark(mark: string) {
        const {state, dispatch} = this.editor().view;
        const type = state.schema.marks[mark];
        if (type) toggleMark(type)(state, dispatch);
        this.editor().view.focus();
    }

    isMarkActive(markTypeName: string) {
        const {state} = this.editor().view;
        const {from, empty} = state.selection;
        const type = state.schema.marks[markTypeName];
        if (!type) return false;

        if (empty) {
            return !!type.isInSet(state.storedMarks || state.selection.$from.marks());
        } else {
            let found = false;
            state.doc.nodesBetween(from, state.selection.to, node => {
                if (type.isInSet(node.marks)) {
                    found = true;
                    return false; // stop iteration
                }
                return true;
            });
            return found;
        }
    }

    undo() {
        let view = this.editor().view;
        undo(view.state, view.dispatch);
        view.focus();
    }

    redo() {
        let view = this.editor().view;
        redo(view.state, view.dispatch);
        view.focus();
    }

    get nodeSpec(): Record<string, NodeSpec> {
        return {}
    }

}
