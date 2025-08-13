import React, {useContext, useEffect, useRef, useState} from "react"
import {ImageNode} from "./ImageNode";
import {TextNode} from "../../core/TreeNode";
import {ParagraphNode} from "../paragraph/ParagraphNode";
import {EditorContext} from "../../contexts/EditorState";

const encodeBase64 = (type: string, subType: string, data: string) => {
    if (data) {
        return `data:${type}/${subType};base64,${data}`
    }
    return null
}

function decodeBase64(result: string) {
    let base64 = /data:(\w+)\/(\w+);base64,((?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{4}|[A-Za-z0-9+\/]{3}=|[A-Za-z0-9+\/]{2}={2}))/g
    let regexResult = base64.exec(result)
    if (regexResult) {
        let type = regexResult[1]
        let subType = regexResult[2]
        let data = regexResult[3]
        return {type, subType, data}
    }
    throw new Error("Cannot decode to Base64")
}

function ImageProcessor(properties: ImageProcessor.Attributes) {

    const {node} = properties

    const [image, setImage] = useState(encodeBase64(node.type, node.subType, node.src))

    const {ast: {root, triggerAST}, cursor: {currentCursor, triggerCursor}, event: {currentEvent}} = useContext(EditorContext)

    const divRef = useRef(null);

    const inputRef = useRef(null);

    const onLoad = (event: any) => {
        let input = event.target
        let files = input.files
        if (files) {
            let file = files[0]

            if (file) {
                let reader = new FileReader()

                reader.addEventListener("load", () => {
                    if (reader.result) {
                        let result = reader.result as string

                        const image = new Image()
                        image.src = result
                        image.onload = () => {
                            let {type, subType, data} = decodeBase64(result);
                            let ratio = image.width / image.height;

                            node.src = data
                            node.type = type
                            node.subType = subType
                            node.aspectRatio = ratio
                            node.width = 360
                            node.height = 360 / ratio
                        }

                        setImage(result)

                        triggerAST()
                    }
                })

                reader.readAsDataURL(file)
            }
        }
    }

    useEffect(() => {
        node.dom = divRef.current
    }, [node]);

    useEffect(() => {
        inputRef.current.click()
    }, []);

    useEffect(() => {

        if (currentEvent.instance && node === currentCursor?.container) {

            switch (currentEvent.instance.type) {
                case "insertLineBreak" : {

                    currentEvent.queue.push({
                        type: "insertLineBreak",
                        source: node,
                        handle(): void {
                            let index = node.parentIndex;
                            let parent = node.parent;
                            let textNode = new TextNode();

                            currentCursor.container = textNode
                            currentCursor.offset = 0

                            parent.insertChild(index + 1, new ParagraphNode([textNode]));
                        }
                    })

                }
                    break
                case "deleteContentBackward" : {

                    currentEvent.queue.push({
                        type: "deleteContentBackward",
                        source: node,
                        handle(): void {
                            let flattened = root.flatten;
                            let index = flattened.indexOf(node);
                            let slice = flattened.slice(0, index);
                            let textNode = slice.findLast(node => node instanceof TextNode);

                            currentCursor.container = textNode
                            currentCursor.offset = textNode.text.length;

                            node.remove()
                        }
                    })

                }
                    break
            }

            triggerCursor()
            triggerAST()
        }

    }, [currentEvent.instance]);

    return (
        <div ref={divRef} style={{display: "flex", justifyContent: "center", alignItems: "center", position: "relative"}}>
            {
                image && <img src={image} style={{maxWidth: node.width, maxHeight: node.height, width: "100%"}}/>
            }
            <input ref={inputRef} onChange={onLoad} type={"file"} style={{display: "none"}}/>
        </div>
    )
}

namespace ImageProcessor {
    export interface Attributes {
        node: ImageNode
    }
}

export default ImageProcessor
