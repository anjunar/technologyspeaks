import { Node } from 'unist';

const getMarkdownPrefix = (value: string): string => {
    if (value === "p") return "";
    const level = Number(value.substring(1));
    return "#".repeat(level) + " ";
};

export class HeadingCommand {

    isActive(textarea : HTMLTextAreaElement, cursor : Node[]) : boolean{
        if (! cursor) {
            return false;
        }

        const isNewLine = textarea.selectionStart === 0 ||
            textarea.value.charAt(textarea.selectionStart - 1) === "\n";

        const isInHeading = cursor.findIndex(node => node.type === "heading") > -1;

        let paragraph = cursor.find(node => node.type === "paragraph");
        let isOnlyText = paragraph?.["children"].every(node => node.type === "text");

        return (isNewLine || isInHeading || isOnlyText)
    }

    execute(textarea : HTMLTextAreaElement, cursor : Node[], value : string, updateAST : () => void) {
        if (!cursor) {
            return;
        }

        const currentHeadingNode = cursor?.find(node => node.type === "heading");

        let paragraph = cursor.find(node => node.type === "paragraph");
        let isOnlyText = paragraph?.["children"].every(node => node.type === "text");


        if (currentHeadingNode || isOnlyText) {
            if (value === "p") {
                currentHeadingNode.type = "paragraph";
                delete currentHeadingNode["depth"];
            } else {
                if (isOnlyText) {
                    paragraph.type = "heading"
                    paragraph["depth"] = Number(value.substring(1));
                } else {
                    currentHeadingNode["depth"] = Number(value.substring(1));
                }

            }
            updateAST();
        } else {
            const pre = textarea.value.substring(0, textarea.selectionStart);
            const post = textarea.value.substring(textarea.selectionStart);
            const heading = getMarkdownPrefix(value);

            textarea.value = `${pre}${heading}${post}`;
            const event = new Event('input', { bubbles: true, cancelable: true });
            textarea.dispatchEvent(event);
            textarea.focus()
            textarea.setSelectionRange(pre.length + heading.length, pre.length + heading.length);
        }
    }

}