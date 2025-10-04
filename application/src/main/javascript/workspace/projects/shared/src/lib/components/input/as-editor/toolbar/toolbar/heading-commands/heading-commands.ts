import {Component, computed, input, ViewEncapsulation} from '@angular/core';
import {EditorView} from "prosemirror-view";
import {setBlockType} from "prosemirror-commands";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'editor-heading-commands',
    imports: [
        FormsModule
    ],
    templateUrl: './heading-commands.html',
    styleUrl: './heading-commands.css',
    encapsulation: ViewEncapsulation.None
})
export class HeadingCommands {

    editor = input<{ view: EditorView }>()

    activeHeading = computed(() => {
        const v = this.editor().view;
        if (!v) return 0;

        const {state} = v;
        const {from, to} = state.selection;

        let foundLevel = 0;
        state.doc.nodesBetween(from, to, node => {
            if (node.type === state.schema.nodes["heading"]) {
                const lvl = node.attrs["level"];
                if (lvl >= 1 && lvl <= 6) {
                    foundLevel = lvl;
                    return false;
                }
            }
            return true;
        });

        return foundLevel;
    });

    setParagraph() {
        const v = this.editor().view;
        if (!v) return;
        const {state, dispatch} = v;
        const paraType = state.schema.nodes["paragraph"];
        if (!paraType) return;
        setBlockType(paraType)(state, dispatch);
        v.focus();
    }

    setHeading(level: number) {
        const {state, dispatch} = this.editor().view;
        const type = state.schema.nodes["heading"];
        if (!type) return;

        setBlockType(type, {level})(state, dispatch);
        this.editor().view.focus();
    }

}
