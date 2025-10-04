import {EditorView} from "prosemirror-view";
import {WritableSignal} from "@angular/core";
import {NodeSpec} from "prosemirror-model";

export abstract class EditorCommandComponent {

    abstract editor: WritableSignal<{ view: EditorView }>

    abstract get nodeSpec(): Record<string, NodeSpec>

}