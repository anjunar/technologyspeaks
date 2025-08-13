import "./MarkDownEditor.css"
import React, {CSSProperties, RefObject, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react"
import Toolbar from "./ui/Toolbar";
import Footer from "./ui/Footer";
import {encodeBase64, findNodesByRange, reMarkFactoryForHTML} from "./parser/ReMarkFactory";
import {Node} from 'unist';
import {useInput} from "../../../hooks";
import {Model} from "../../shared";
import EditorModel from "./domain/EditorModel";
import EditorFile from "./domain/EditorFile";
import JsFlag from "../../layout/jsFlag/JsFlag";


export const MarkDownContext = React.createContext<MarkDownEditor.Context>(null)

function MarkDownEditor(properties: MarkDownEditor.Attributes) {

    const {style, value, standalone, name, onModel, onChange} = properties

    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const [page, setPage] = useState(0)

    const [model, state, setState] = useInput<EditorModel>(name, value, standalone, "editor")

    const [cursor, setCursor] = useState<Node[]>(null)

    const reMarkForHTML = useMemo(() => {
        return reMarkFactoryForHTML(state)
    }, []);

    function onStoreClick(file: EditorFile) {
        let textArea = textAreaRef.current;

        let selectionStart = textArea.selectionStart;
        let selectionEnd = textArea.selectionEnd

        let pre = textArea.value.substring(0, selectionStart);
        let post = textArea.value.substring(selectionEnd);

        textArea.value = `${pre}![Picture](${file.name})${post}`

        const event = new Event('input', {bubbles: true, cancelable: true});

        textArea.dispatchEvent(event);
    }

    function onSelect() {
        let textArea = textAreaRef.current;

        const nodes = findNodesByRange(state.ast, textArea.selectionStart, textArea.selectionEnd);

        setCursor(nodes.filter(node => node.type !== "root"))
    }

    useEffect(() => {
        // For form validation -> Error messages
        model.callbacks.push((validate: boolean) => {
            if (onModel) {
                onModel(model)
            }
        })

        if (onModel) {
            onModel(model)
        }
    }, []);

    useEffect(() => {
        state.ast = reMarkForHTML.parse(state.markdown);

        if (onChange) {
            onChange(state)
        }

        if (onModel) {
            onModel(model)
        }


    }, [state.markdown]);

    useLayoutEffect(() => {
        if (onModel) {
            onModel(model)
        }
    }, [value, model.dirty]);

    return (
        <div className={"markdown-editor"} style={style}>
            <MarkDownContext.Provider value={{model: state, textAreaRef, cursor, updateAST() {}}}>
                <JsFlag showWhenJs={true}>
                    <Toolbar page={page} onPage={value => setPage(value)}/>
                </JsFlag>
                <textarea name={name} onSelect={onSelect} ref={textAreaRef} onInput={(event: any) => state.markdown = event.target.value} defaultValue={state.markdown} className={"content"}></textarea>
                <div style={{display: "flex", flexDirection: "row", gap : "16px"}}>
                    {
                        state?.files?.map(file => (
                            <div key={file.name} style={{display: "flex", alignItems : "center", gap : "8px"}}>
                                <img title={file.name} src={encodeBase64(file.contentType, file.data)} style={{height: "32px"}} onClick={() => onStoreClick(file)}/>
                                <input type={"checkbox"} name={"files:delete"} value={file.id}/>
                            </div>
                        ))
                    }
                </div>
                <JsFlag showWhenJs={true}>
                    <Footer page={page} onPage={(value) => setPage(value)}/>
                </JsFlag>
            </MarkDownContext.Provider>
        </div>
    )
}

namespace MarkDownEditor {
    export interface Attributes {
        style?: CSSProperties
        name?: string
        standalone?: boolean
        value?: EditorModel
        onChange?: (value: EditorModel) => void
        onModel?: (value: Model) => void
    }

    export interface Context {
        model: EditorModel
        textAreaRef: RefObject<HTMLTextAreaElement>
        cursor: Node[]

        updateAST(): void
    }
}

export default MarkDownEditor