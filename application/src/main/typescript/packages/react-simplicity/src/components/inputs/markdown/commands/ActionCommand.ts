export abstract class AbstractActionCommand {

    abstract canExecute(textArea : HTMLTextAreaElement) : boolean

    abstract execute(textArea: HTMLTextAreaElement) : void

}

export abstract class AbstractBlockCommand extends AbstractActionCommand {

    abstract get blockType(): string

    execute(textArea: HTMLTextAreaElement): void {
        const pre = textArea.value.substring(0, textArea.selectionStart);
        const post = textArea.value.substring(textArea.selectionStart);
        const insertedText = this.blockType;
        textArea.value = `${pre}${insertedText}${post}`;
        const pos = pre.length + insertedText.length;
        textArea.setSelectionRange(pos, pos);
        textArea.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
        textArea.focus();
        textArea.setSelectionRange(pre.length + insertedText.length, pre.length + insertedText.length);
    }
}

export class ListActionCommand extends AbstractBlockCommand {

    get blockType(): string {
        return "- ";
    }

    canExecute(textArea: HTMLTextAreaElement): boolean {
        const value = textArea.value;
        const pos = textArea.selectionStart;

        if (pos === 0) return true;

        const before = value.substring(0, pos);

        const lines = before.split('\n');
        const currentLine = lines[lines.length - 1];

        if (currentLine.trim() === "") return true;

        const listPattern = /^(\s*)([-*+]|\d+\.)\s+/;

        return listPattern.test(currentLine);
    }

}

export class BlockQuoteCommand extends AbstractBlockCommand {

    get blockType(): string {
        return "> "
    }

    canExecute(textArea: HTMLTextAreaElement): boolean {
        return textArea.value.charAt(textArea.selectionStart - 1) === "\n" || textArea.selectionStart === 0
    }

}

export class HorizontalLineCommand extends AbstractBlockCommand {

    get blockType(): string {
        return "---"
    }

    canExecute(textArea: HTMLTextAreaElement): boolean {
        return textArea.value.charAt(textArea.selectionStart - 1) === "\n" || textArea.selectionStart === 0
    }

}

export class TableCommand extends AbstractBlockCommand {

    get blockType(): string {
        return `| Column 1 | Column 2 | Column 3 | \n| -------- | -------- | -------- | \n| Cell 1   | Cell 2   | Cell 3   |`
    }

    canExecute(textArea: HTMLTextAreaElement): boolean {
        return textArea.value.charAt(textArea.selectionStart - 1) === "\n" || textArea.selectionStart === 0
    }
}

export class CodeCommand extends AbstractBlockCommand {

    get blockType(): string {
        return "```js\nconsole.log('Hello World')\n```"
    }

    canExecute(textArea: HTMLTextAreaElement): boolean {
        return textArea.value.charAt(textArea.selectionStart - 1) === "\n" || textArea.selectionStart === 0
    }

}
