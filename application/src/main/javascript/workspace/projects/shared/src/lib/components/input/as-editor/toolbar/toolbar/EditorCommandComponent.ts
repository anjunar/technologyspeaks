import {EditorView} from "prosemirror-view";
import {WritableSignal} from "@angular/core";
import {NodeSpec, Schema} from "prosemirror-model";
import {Plugin} from "prosemirror-state";

export abstract class EditorCommandComponent {

    abstract editor: WritableSignal<{ view: EditorView }>

    abstract get nodeSpec(): Record<string, NodeSpec>

    abstract plugins(schema: Schema) : Plugin[]

}