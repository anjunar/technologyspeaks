import React, {useContext, useEffect, useState} from "react"
import {ImageNode} from "./ImageNode";
import {TextNode} from "../../core/TreeNode";
import {ParagraphNode} from "../paragraph/ParagraphNode";
import OrderNode from "../shared/OrderNode";
import {EditorContext} from "../../contexts/EditorState";

function ImageTool(properties: ImageTool.Attributes) {

    const {node} = properties

    const [width, setWidth] = useState(node.width)

    const [height, setHeight] = useState(node.height)

    const [aspectRatio, setAspectRatio] = useState(node.aspectRatio)

    const {ast: {root, triggerAST}, cursor: {currentCursor, triggerCursor}} = useContext(EditorContext)

    function onWidthChange(event: React.ChangeEvent<HTMLInputElement>) {
        setWidth(event.target.valueAsNumber)
    }

    function onHeightChange(event: React.ChangeEvent<HTMLInputElement>) {
        setHeight(event.target.valueAsNumber)
    }

    function onSendClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.stopPropagation()

        node.width = width
        node.height = height

        triggerAST()
    }

    useEffect(() => {
        let result = Math.round(height * aspectRatio * 100) / 100;
        if (result !== width) {
            setWidth(result)
        }

    }, [height]);

    useEffect(() => {
        let result = Math.round((width / aspectRatio) * 100) / 100;
        if (result !== height) {
            setHeight(result)
        }
    }, [width]);

    function onDeleteImage() {
        node.remove()

        triggerAST()
    }


    function onAddText() {
        let textNode = new TextNode("");
        node.after(new ParagraphNode([textNode]))

        currentCursor.container = textNode
        currentCursor.offset = 0

        triggerCursor()
        triggerAST()
    }

    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            <div style={{padding: "4px"}}>
                <input value={width} onChange={onWidthChange} type={"number"} placeholder={"Width"} style={{width: "50px"}} onClick={event => event.stopPropagation()}/>
                x
                <input value={height} onChange={onHeightChange} type={"number"} placeholder={"Height"} style={{width: "50px", textAlign: "right"}} onClick={event => event.stopPropagation()}/>
            </div>
            <button onClick={onSendClick}>Ok</button>
            <hr style={{width: "100%"}}/>
            <button onClick={onDeleteImage} className={"container"}><span className={"material-icons"}>delete</span>Delete Image</button>
            <button onClick={onAddText} className={"container"}><span className={"material-icons"}>add</span>Add Text</button>
            <hr style={{width: "100%"}}/>
            <OrderNode node={node}/>
        </div>
    )
}

namespace ImageTool {
    export interface Attributes {
        node: ImageNode
    }
}

export default ImageTool