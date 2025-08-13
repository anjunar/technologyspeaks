import {TextNode} from "../core/TreeNode";
import {over, partial} from "../utils/SelectionUtils";
import EditorState from "../contexts/EditorState";

export abstract class AbstractCommand<E> {
    abstract execute(value: E, context: EditorState.Context): void;
}

export abstract class AbstractFormatCommand<E> extends AbstractCommand<E> {

    abstract get format(): string;

    execute(value: E, context: EditorState.Context): void {

        const {ast : {root, triggerAST}, cursor: {currentCursor, triggerCursor}, selection: {currentSelection, triggerSelection}} = context

        if (currentSelection) {

            if (currentSelection.startContainer === currentSelection.endContainer) {
                let container = currentSelection.startContainer;

                if (container instanceof TextNode) {
                    let textNode = partial(currentSelection);
                    textNode[this.format] = value
                }
            } else {
                let nodes = over(currentSelection, root);

                for (const node of nodes) {
                    if (node instanceof TextNode) {
                        node[this.format] = value;
                    }
                }

            }

            triggerSelection()

        } else {
            if (currentCursor && currentCursor.container instanceof TextNode) {
                currentCursor.container[this.format] = value
                triggerCursor()
            }
        }

        triggerAST()

    }
}