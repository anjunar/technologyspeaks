import {TextNode} from "../../core/TreeNode";
import {CSSProperties} from "react";

export function generateStyleObject(node: TextNode) {
    let style: CSSProperties = {};
    if (node.fontFamily) {
        style.fontFamily = node.fontFamily;
    }

    if (node.fontSize) {
        style.fontSize = node.fontSize;
    }

    if (node.color) {
        style.color = node.color;
    }

    if (node.backgroundColor) {
        style.backgroundColor = node.backgroundColor;
    }
    return style;
}

export function generateStyleClassNames(node: TextNode) {
    let classNames: string[] = []

    if (node.bold) {
        classNames.push("bold")
    }

    if (node.italic) {
        classNames.push("italic")
    }

    if (node.deleted) {
        classNames.push("deleted")
    }

    if (node.sub) {
        classNames.push("subscript")
    }

    if (node.sup) {
        classNames.push("superscript")
    }

    if (node.block) {
        classNames.push(node.block)
    }

    return classNames;
}