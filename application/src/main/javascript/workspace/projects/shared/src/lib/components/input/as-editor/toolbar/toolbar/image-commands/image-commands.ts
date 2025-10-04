import {Component, inject, signal, ViewEncapsulation} from '@angular/core';
import {AsIcon} from "../../../../../layout/as-icon/as-icon";
import {DOMOutputSpec, NodeSpec, Schema} from "prosemirror-model";
import {EditorView} from "prosemirror-view";
import {WindowManagerService} from "../../../../../modal/as-window/service/window-manager-service";
import {ImageWindow} from "./image-window/image-window";
import {NodeSelection, Plugin} from "prosemirror-state";
import {EditorCommandComponent} from "../EditorCommandComponent";

@Component({
    selector: 'editor-image-commands',
    imports: [
        AsIcon
    ],
    templateUrl: './image-commands.html',
    styleUrl: './image-commands.css',
    encapsulation: ViewEncapsulation.None
})
export class ImageCommands extends EditorCommandComponent {

    editor = signal<{ view: EditorView }>({view: null})

    service = inject(WindowManagerService)

    open() {
        const view = this.editor()?.view;
        let attrs: any = {};

        if (view) {
            const {state} = view;
            const imageType = state.schema.nodes["image"];

            if (state.selection instanceof NodeSelection && state.selection.node.type === imageType) {
                attrs = {...state.selection.node.attrs};
            }
        }

        this.service.open({
            id: "openImage",
            title: "Add Image",
            component: ImageWindow,
            inputs: {
                parent: this,
                attrs: attrs
            }
        })
    }

    close(src: string, width?: number, height?: number) {
        this.service.close("openImage");
        this.insertImage(src, width, height)
    }

    insertImage(src: string, width?: number, height?: number, pos?: number | null) {
        const view = this.editor()?.view;
        if (!view || !src) return;

        const { state, dispatch } = view;
        const imageType = state.schema.nodes["image"];
        if (!imageType) return;

        let style = "";
        if (width != null) style += `width:${width}px;`;
        if (height != null) style += `height:${height}px;`;
        const styleAttr = style || null;

        let baseAttrs = {};
        if (typeof pos === "number") {
            const node = state.doc.nodeAt(pos);
            if (node) baseAttrs = { ...node.attrs };
        }

        const attrs = {
            ...baseAttrs,
            src,
            style: styleAttr
        };

        let tr = state.tr;

        if (typeof pos === "number") {
            tr = tr.setNodeMarkup(pos, imageType, attrs);
        } else if (state.selection instanceof NodeSelection && state.selection.node.type === imageType) {
            tr = tr.setNodeMarkup(state.selection.from, imageType, attrs);
        } else {
            tr = tr.replaceSelectionWith(imageType.create(attrs), false);
        }

        dispatch(tr.scrollIntoView());
        view.focus();
    }

    plugins(schema: Schema): Plugin[] {
        let self = this
        return [new Plugin({
            props: {
                handleDOMEvents: {
                    dblclick(view, event) {
                        const target = event.target as HTMLElement;
                        if (target && target.nodeName === "IMG") {
                            self.open()
                            return true;
                        }
                        return false;
                    }
                }
            }
        })];
    }

    get nodeSpec(): NodeSpec {
        return {
            image: {
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
                toDOM: (node : any) => {
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
            }
        }
    }

}
