import { Node } from 'unist';

export function unwrapFormatInline(nodes: Node[], typeToRemove: string): void {
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        if ('children' in node && Array.isArray(node.children)) {
            unwrapFormatInline(node.children, typeToRemove);
        }

        if (node.type === typeToRemove && 'children' in node && Array.isArray(node.children)) {
            nodes.splice(i, 1, ...node.children);
            i += node.children.length - 1;
        }
    }
}

export abstract class AbstractFormatCommand {

    abstract isActive(state : boolean, cursor : Node[], textArea : HTMLTextAreaElement) : boolean

    canExecute(cursor : Node[], textArea : HTMLTextAreaElement) : boolean {
        return ! cursor.some(node => node.type === "heading")
    }

    execute(state : boolean, cursor : Node[], textArea : HTMLTextAreaElement) :  void {
        if (state) {
            unwrapFormatInline(cursor, this.type)
        } else {
            let pre = textArea.value.substring(0, textArea.selectionStart)
            let selection = textArea.value.substring(textArea.selectionStart, textArea.selectionEnd)
            let post = textArea.value.substring(textArea.selectionEnd)

            textArea.value = `${pre}${this.symbol}${selection}${this.symbol}${post}`

            const event = new Event('input', {bubbles: true, cancelable: true})

            textArea.dispatchEvent(event);

        }
    }

    abstract get type() : string

    abstract get symbol() : string

}

export class BoldCommand extends AbstractFormatCommand {

    isActive(state: boolean, cursor: Node[], textArea: HTMLTextAreaElement): boolean {
        return cursor.some(token => token.type === "strong")
    }

    get symbol() {
        return "**"
    }

    get type() {
        return "strong"
    }
}

export class ItalicCommand extends AbstractFormatCommand {

    isActive(state: boolean, cursor: Node[], textArea: HTMLTextAreaElement): boolean {
        return cursor.some(token => token.type === "emphasis")
    }

    get symbol() {
        return "*"
    }

    get type() {
        return "emphasis"
    }

}

export class DeletedCommand extends AbstractFormatCommand {

    isActive(state: boolean, cursor: Node[], textArea: HTMLTextAreaElement): boolean {
        return cursor.some(token => token.type === "delete")
    }

    get symbol() {
        return "~~"
    }

    get type() {
        return "delete"
    }

}
