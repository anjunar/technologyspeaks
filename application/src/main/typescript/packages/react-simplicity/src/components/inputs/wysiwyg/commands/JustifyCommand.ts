import {AbstractCommand} from "./AbstractCommands";
import EditorState from "../contexts/EditorState";

export class JustifyCommand extends AbstractCommand<string> {

    execute(value: string, context: EditorState.Context): void {

        const { ast : {triggerAST}, cursor : {currentCursor} } = context;

        if (currentCursor) {

            let parent = currentCursor.container.parent;

            parent.justify = value

            triggerAST()

        }

    }

}