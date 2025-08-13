import "./Editor.css"
import React, {useContext, useEffect, useState} from "react"
import Footer from "./ui/Footer";
import Inspector from "./ui/Inspector";
import Toolbar from "./ui/Toolbar";
import Cursor from "./ui/Cursor";
import ProcessorFactory from "./blocks/shared/ProcessorFactory";
import InputManager from "./manager/InputManager";
import CursorManager from "./manager/CursorManager";
import SelectionManager from "./manager/SelectionManager";
import InspectorManager from "./manager/InspectorManager";
import {EditorContext} from "./contexts/EditorState";
import {RootNode, TextNode} from "./core/TreeNode";
import {DomContext} from "./contexts/DomState";
import {TokenNode} from "./blocks/code/TokenNode";
import {findParent} from "./core/TreeNodes";
import {CodeNode} from "./blocks/code/CodeNode";
import InputText from "./ui/InputText";
import {useInput} from "../../../hooks/UseInputHook";

function Editor(properties: Editor.Attributes) {

    const {style, name, standalone, value} = properties

    const [page, setPage] = useState(0)

    const [model, root, setRoot] = useInput(name, value, standalone, "editor")

    const {ast, cursor : {currentCursor}} = useContext(EditorContext)

    const {editorRef, contentEditableRef} = useContext(DomContext)

    useEffect(() => {
        ast.root = root
        ast.triggerAST()
    }, [root]);

    useEffect(() => {

        setRoot(ast.root)

        function onPaste(event : ClipboardEvent) {
            event.preventDefault()

            let text = event.clipboardData.getData("text");

            let container = currentCursor.container;

            if (container instanceof TextNode) {
                let start = container.text.substring(0, currentCursor.offset);
                let end = container.text.substring(currentCursor.offset);

                container.text = start + text + end
            }

            if (container instanceof TokenNode) {
                let codeNode = findParent(container, node => node instanceof CodeNode) as CodeNode

                let number = container.index + currentCursor.offset;
                let start = codeNode.text.substring(0, number);
                let end = codeNode.text.substring(number);

                let newText = start + text + end;
                codeNode.updateText(newText, "", number)
            }

            ast.triggerAST()
        }

        document.addEventListener("paste", onPaste)

        return () => {
            document.removeEventListener("paste", onPaste)
        }
    }, [ast]);

    return (
        <div ref={editorRef} className={"editor"} style={style}>
                <Toolbar page={page} onPage={value => setPage(value)}/>
                <div ref={contentEditableRef} style={{position : "relative", height : "50%", overflowY: "auto", overflowX : "hidden", flex : 1}}>
                    <ProcessorFactory node={ast.root}/>
                    <Cursor />
                    <Inspector/>
                    <InputText/>
                </div>
                <CursorManager/>
                <SelectionManager/>
                <InspectorManager/>
                <InputManager/>
            <Footer page={page} onPage={(value) => setPage(value)}/>
        </div>
    )
}

namespace Editor {
    export interface Attributes {
        style?: React.CSSProperties
        name? : string
        standalone? : boolean
        value? : RootNode
    }
}

export default Editor