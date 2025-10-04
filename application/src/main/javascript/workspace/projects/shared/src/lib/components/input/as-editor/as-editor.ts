import {
    Component, computed,
    effect,
    ElementRef,
    inject,
    Type, untracked,
    viewChild,
    ViewContainerRef,
    ViewEncapsulation
} from '@angular/core';
import {EditorState, Plugin} from "prosemirror-state";
import {schema as basicSchema} from "prosemirror-schema-basic";
import {EditorView} from "prosemirror-view";
import {history, redo, undo} from "prosemirror-history";
import {keymap} from "prosemirror-keymap";
import {baseKeymap, chainCommands, exitCode, newlineInCode, splitBlock} from "prosemirror-commands";
import {Schema} from "prosemirror-model";
import {addListNodes} from "prosemirror-schema-list";
import {ImageCommands} from "./toolbar/toolbar/image-commands/image-commands";
import {BaseCommands} from "./toolbar/toolbar/base-commands/base-commands";
import {HeadingCommands} from "./toolbar/toolbar/heading-commands/heading-commands";
import {LinkCommands} from "./toolbar/toolbar/link-commands/link-commands";
import {ListCommands} from "./toolbar/toolbar/list-commands/list-commands";
import {EditorCommandComponent} from "./toolbar/toolbar/EditorCommandComponent";
import {TableCommands} from "./toolbar/toolbar/table-commands/table-commands";
import {AsControlInput} from "../../../directives/as-control";
import {NG_VALUE_ACCESSOR} from "@angular/forms";

const commands: Type<EditorCommandComponent>[] = [BaseCommands, HeadingCommands, ImageCommands, LinkCommands, ListCommands, TableCommands]

@Component({
    selector: 'as-editor',
    imports: [],
    templateUrl: './as-editor.html',
    styleUrl: './as-editor.css',
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: AsEditor,
            multi: true
        }, {
            provide: AsControlInput,
            useExisting: AsEditor,
        }
    ]
})
export class AsEditor extends AsControlInput<string> {

    editorContainer = viewChild<ElementRef<HTMLDivElement>>("editorContainer")

    toolbar = viewChild("toolbar", {read: ViewContainerRef})

    el = inject<ElementRef<HTMLElement>>(ElementRef<HTMLElement>).nativeElement

    constructor() {
        super();

        const instances = computed(() => {
            return commands.map(command => {
                let componentRef = this.toolbar().createComponent(command);
                return componentRef.instance
            })
        })

        effect(() => {

            const self = this;

            const model = untracked(() => this.model());

            const stateListenerPlugin = new Plugin({
                view() {
                    return {
                        update(view) {
                            instances().forEach(instance => instance.editor.set({view}))
                            self.onChange.forEach(fn => fn(self.name(), JSON.stringify(view.state.doc.toJSON()), self.default(), self.el));
                        },
                        destroy() {
                        }
                    };
                }
            });

            let specs = instances().reduce((prev: any, instance) => {
                return Object.assign(prev, instance.nodeSpec)
            }, {})

            const nodes = addListNodes(
                basicSchema.spec.nodes.append(specs),
                "paragraph block*",
                "block"
            );

            const schema = new Schema({
                nodes,
                marks: basicSchema.spec.marks
            });

            let plugins = instances().flatMap(instance => instance.plugins(schema))

            const state = EditorState.create({
                schema,
                doc : model ? schema.nodeFromJSON(JSON.parse(model)) : undefined,
                plugins: [
                    ...plugins,
                    stateListenerPlugin,
                    history(),
                    keymap({
                        "Enter": chainCommands(
                            newlineInCode,
                            splitBlock,
                            exitCode
                        ),
                        "Mod-z": undo,
                        "Mod-y": redo,
                        "Mod-Shift-z": redo
                    }),
                    keymap(baseKeymap)
                ]
            });

            let editorView = new EditorView(this.editorContainer().nativeElement, {state});

            instances().forEach(instance => instance.editor.set({view: editorView}))

            return () => {
                console.log("destroy")
                editorView.destroy();
            }
        });
    }

    controlAdded(): void {}

    setDisabledState(isDisabled: boolean): void {
        this.el.setAttribute("disabled", "true")
    }

}
