import {
    Component,
    effect,
    ElementRef,
    signal,
    Type,
    viewChild,
    ViewContainerRef,
    ViewEncapsulation
} from '@angular/core';
import {Command, EditorState, Plugin} from "prosemirror-state";
import {schema as basicSchema} from "prosemirror-schema-basic";
import {EditorView} from "prosemirror-view";
import {history, redo, undo} from "prosemirror-history";
import {keymap} from "prosemirror-keymap";
import {baseKeymap, chainCommands, exitCode, newlineInCode, splitBlock} from "prosemirror-commands";
import {NodeType, Schema} from "prosemirror-model";
import {addListNodes, liftListItem, splitListItem} from "prosemirror-schema-list";
import {ImageCommands} from "./toolbar/toolbar/image-commands/image-commands";
import {BaseCommands} from "./toolbar/toolbar/base-commands/base-commands";
import {HeadingCommands} from "./toolbar/toolbar/heading-commands/heading-commands";
import {LinkCommands} from "./toolbar/toolbar/link-commands/link-commands";
import {ListCommands} from "./toolbar/toolbar/list-commands/list-commands";
import {EditorCommandComponent} from "./toolbar/toolbar/EditorCommandComponent";


const commands: Type<EditorCommandComponent>[] = [BaseCommands, HeadingCommands, ImageCommands, LinkCommands, ListCommands]

@Component({
    selector: 'as-editor',
    imports: [],
    templateUrl: './as-editor.html',
    styleUrl: './as-editor.css',
    encapsulation: ViewEncapsulation.None
})
export class AsEditor {

    editorContainer = viewChild<ElementRef<HTMLDivElement>>("editorContainer")

    toolbar = viewChild("toolbar", {read: ViewContainerRef})

    constructor() {
        effect(() => {

            const instances = commands.map(command => {
                let componentRef = this.toolbar().createComponent(command);
                return componentRef.instance
            })

            const stateListenerPlugin = new Plugin({
                view() {
                    return {
                        update(view) {
                            instances.forEach(instance => instance.editor.set({view}))
                        },
                        destroy() {}
                    };
                }
            });

            instances.forEach(instance => {
                basicSchema.spec.nodes.append(instance.nodeSpec)
            })

            const nodes = addListNodes(
                basicSchema.spec.nodes,
                "paragraph block*",
                "block"
            );

            const schema = new Schema({
                nodes,
                marks: basicSchema.spec.marks
            });

            function customEnterCommand(listItemType: NodeType): Command {
                return (state, dispatch, view) => {
                    const {$from, empty} = state.selection;

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

            let editorView = new EditorView(this.editorContainer().nativeElement, {state});

            instances.forEach(instance => instance.editor.set({view : editorView}))

        });
    }

}
