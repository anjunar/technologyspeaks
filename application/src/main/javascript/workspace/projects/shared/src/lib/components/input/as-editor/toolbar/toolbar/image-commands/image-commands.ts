import {Component, ElementRef, inject, input, viewChild, ViewEncapsulation} from '@angular/core';
import {AsIcon} from "../../../../../layout/as-icon/as-icon";
import {DOMOutputSpec, NodeSpec} from "prosemirror-model";
import {EditorView} from "prosemirror-view";
import {WindowManagerService} from "../../../../../modal/as-window/service/window-manager-service";
import {ImageWindow} from "./image-window/image-window";
import {NodeSelection} from "prosemirror-state";

@Component({
    selector: 'editor-image-commands',
    imports: [
        AsIcon
    ],
    templateUrl: './image-commands.html',
    styleUrl: './image-commands.css',
    encapsulation: ViewEncapsulation.None
})
export class ImageCommands {

    editor = input<{ view: EditorView }>()

    service = inject(WindowManagerService)

    open() {
        const view = this.editor()?.view;
        let attrs: any = {};

        if (view) {
            const { state } = view;
            const imageType = state.schema.nodes["image"];

            if (state.selection instanceof NodeSelection && state.selection.node.type === imageType) {
                attrs = { ...state.selection.node.attrs };
            }
        }

        this.service.open({
            id : "openImage",
            title : "Add Image",
            component : ImageWindow,
            inputs : {
                parent : this,
                attrs : attrs
            }
        })
    }

    close(src: string, width?: number, height?: number) {
        this.service.close("openImage");
        this.insertImage(src, width, height)
    }

    insertImage(src: string, width?: number, height?: number) {
        const view = this.editor()?.view;
        if (!view || !src) return;

        const {state, dispatch} = view;
        const imageType = state.schema.nodes["image"];
        if (!imageType) {
            console.warn("image node type not found in schema.");
            return;
        }

        let style = "";
        if (width) style += `width:${width}px;`;
        if (height) style += `height:${height}px;`;

        const tr = state.tr.replaceSelectionWith(
            imageType.create({src, style}),
            false
        );

        dispatch(tr.scrollIntoView());
        view.focus();
    }

    static get nodeSpec(): NodeSpec {
        return {
            inline: true,
            attrs: {
                src: {default: null},
                alt: {default: null},
                title: {default: null},
                style: {default: null}
            },
            group: "inline",
            draggable: true,
            parseDOM: [{
                tag: "img[src]",
                getAttrs: (dom: any) => ({
                    src: dom.getAttribute("src"),
                    title: dom.getAttribute("title"),
                    alt: dom.getAttribute("alt"),
                    style: dom.getAttribute("style")
                })
            }],
            toDOM: (node) => {
                const attrs: { src: string; alt?: string; title?: string; style?: string; } = {
                    src: node.attrs["src"],
                    alt: node.attrs["alt"],
                    title: node.attrs["title"],
                    style: node.attrs["style"]
                };

                // @ts-ignore
                Object.keys(attrs).forEach(key => attrs[key] == null && delete attrs[key]);

                return ["img", attrs] as DOMOutputSpec;
            }
        };
    }

}
