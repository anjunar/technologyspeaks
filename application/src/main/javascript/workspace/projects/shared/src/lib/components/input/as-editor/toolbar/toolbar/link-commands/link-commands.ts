import {Component, inject, input, signal, ViewEncapsulation} from '@angular/core';
import {EditorView} from "prosemirror-view";
import {WindowManagerService} from "../../../../../modal/as-window/service/window-manager-service";
import {LinkWindow} from "./link-window/link-window";
import {Plugin, TextSelection} from "prosemirror-state";
import {AsIcon} from "../../../../../layout/as-icon/as-icon";
import {EditorCommandComponent} from "../EditorCommandComponent";
import {NodeSpec, Schema} from "prosemirror-model";

@Component({
    selector: 'editor-link-commands',
    imports: [
        AsIcon
    ],
    templateUrl: './link-commands.html',
    styleUrl: './link-commands.css',
    encapsulation: ViewEncapsulation.None
})
export class LinkCommands extends EditorCommandComponent  {

    service = inject(WindowManagerService)

    editor = signal<{view : EditorView}>({view : null})


    openLink() {
        this.service.open({
            id: "openLink",
            title: "Add Link",
            component: LinkWindow,
            inputs: {
                parent: this
            }
        })
    }

    closeLink(href: string) {
        this.service.close("openLink");
        this.insertLink(href)
    }

    insertLink(href: string) {
        const view = this.editor()?.view;
        if (!view || !href) return;

        const {state, dispatch} = view;
        const linkMark = state.schema.marks["link"];
        if (!linkMark) {
            console.warn("Link mark not found in schema.");
            return;
        }

        const {from, to, empty} = state.selection;
        let tr = state.tr;

        if (empty) {
            const textNode = state.schema.text(href, [linkMark.create({href})]);
            tr = tr.replaceSelectionWith(textNode, false);
            tr = tr.setSelection(TextSelection.create(tr.doc, from + href.length));
        } else {
            tr = tr.removeMark(from, to, linkMark);
            tr = tr.addMark(from, to, linkMark.create({href}));
        }

        dispatch(tr.scrollIntoView());
        view.focus();
    }

    get nodeSpec(): Record<string, NodeSpec> {
        return {}
    }

    plugins(schema: Schema): Plugin[] {
        return [];
    }

}
