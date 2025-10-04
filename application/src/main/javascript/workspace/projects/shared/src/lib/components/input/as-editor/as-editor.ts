import {Component, computed, effect, ElementRef, signal, viewChild, ViewEncapsulation} from '@angular/core';
import {Command, EditorState, Plugin} from "prosemirror-state";
import {schema as basicSchema} from "prosemirror-schema-basic";
import {EditorView} from "prosemirror-view";
import {history, redo, undo} from "prosemirror-history";
import {keymap} from "prosemirror-keymap";
import {baseKeymap, chainCommands, exitCode, newlineInCode, splitBlock} from "prosemirror-commands";
import {Toolbar} from "./toolbar/toolbar/toolbar";
import {NodeType, Schema} from "prosemirror-model";
import {addListNodes, liftListItem, splitListItem} from "prosemirror-schema-list";
import {NodeSpec, DOMOutputSpec} from "prosemirror-model";
import {ImageCommands} from "./toolbar/toolbar/image-commands/image-commands";


@Component({
    selector: 'as-editor',
    imports: [
        Toolbar
    ],
    templateUrl: './as-editor.html',
    styleUrl: './as-editor.css',
    encapsulation: ViewEncapsulation.None
})
export class AsEditor {

    editorContainer = viewChild<ElementRef<HTMLDivElement>>("editorContainer")

    editor = signal<{view : EditorView}>({view : null})

    constructor() {
        effect(() => {

            let viewSignal = this.editor

            const stateListenerPlugin = new Plugin({
                view() {
                    return {
                        update(view) {
                            viewSignal.set({view})
                        },
                        destroy() {
                            viewSignal.set(null)
                        }
                    };
                }
            });

            const nodes = addListNodes(
                basicSchema.spec.nodes.append({image: ImageCommands.nodeSpec}),
                "paragraph block*",
                "block"
            );

            const schema = new Schema({
                nodes,
                marks: basicSchema.spec.marks
            });

            function customEnterCommand(listItemType : NodeType): Command {
                return (state, dispatch, view) => {
                    const { $from, empty } = state.selection;

                    if (empty && $from.parent.content.size === 0) {
                        return liftListItem(listItemType)(state, dispatch);
                    }

                    return splitListItem(listItemType)(state, dispatch, view);
                };
            }

            const state = EditorState.create({
                schema,
                plugins: [
                    stateListenerPlugin,
                    history(),
                    keymap({
                        "Enter": chainCommands(
                            customEnterCommand(schema.nodes["list_item"]),
                            newlineInCode,
                            splitBlock,
                            exitCode
                        ),
                        "Mod-z": undo,
                        "Mod-y": redo,
                        "Mod-Shift-z": redo
                    }),
                    keymap(baseKeymap)],

            });

            this.editor.set({view : new EditorView(this.editorContainer().nativeElement, {state})})
        });
    }

}
