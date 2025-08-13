import {Plugin, unified} from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import remarkStringify from 'remark-stringify';
import rehypePrism from 'rehype-prism-plus'
import remarkGfm from 'remark-gfm'
import html from 'remark-html'
import {visit} from 'unist-util-visit';
import type {Element} from 'hast';
import {Node} from 'unist';
import EditorModel from "../domain/EditorModel";

export const encodeBase64 = (type: string, data: string) => {
    if (data) {
        return `data:${type};base64,${data}`
    }
    return null
}


export function createImagePlugin(model: EditorModel): Plugin {
    return () => (tree: any) => {
        visit(tree, 'element', (node: Element) => {
            if (node.tagName === 'img' && node.properties?.src) {
                const href = node.properties.src as string;
                const file = model.files.find(f => f.name === href);

                if (file) {
                    node.properties.src = encodeBase64(file.contentType, file.data);
                    node.properties.style = 'width: 100%';
                }
            }
        });
    };
}

export function reMarkFactoryForHTML(model: EditorModel) {
    return unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(createImagePlugin(model))
        .use(rehypePrism)
        .use(rehypeStringify)
        .use(remarkGfm)

}

export function reMarkFactoryForMarkDown(model: EditorModel) {
    return unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(createImagePlugin(model))
        .use(rehypePrism)
        .use(remarkStringify)
        .use(remarkGfm)

}


export function findNodesByRange(node: Node, start: number, end: number): Node[] {
    const results: Node[] = [];

    function visit(n: Node) {
        const pos = n.position;
        if (pos && pos.start.offset !== undefined && pos.end.offset !== undefined) {
            const nodeStart = pos.start.offset;
            const nodeEnd = pos.end.offset;

            const overlaps = nodeEnd > start && nodeStart < end;
            if (overlaps) {
                results.push(n);
            }
        }

        if ('children' in n && Array.isArray(n.children)) {
            n.children.forEach(visit);
        }
    }

    visit(node);
    return results;
}