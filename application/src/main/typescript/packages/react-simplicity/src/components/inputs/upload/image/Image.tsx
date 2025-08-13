import "./Image.css"
import React, {CSSProperties, useState} from "react";
import Window from "../../../modal/window/Window";
import ImageUpload from "./ImageUpload";
import Media from "./Media";
import {useInput} from "../../../../hooks/UseInputHook";
import {createPortal} from "react-dom";

function Image(properties: Image.Attributes) {

    const {name, value, onChange, placeholder, disabled, standalone, style} = properties

    const [open, setOpen] = useState(false)

    const [model, state, setState] = useInput(name, value, standalone, "image");

    const onImageChange = (media: Media) => {

        setState(media)

        if (onChange) {
            onChange(media)
        }
    }

    const encodeBase64 = (type: string, data: string) => {
        if (data) {
            return `data:${type};base64,${data}`
        }
        return ""
    }

    return (
        <div style={style} className={"image"}>
            {
                open && (
                    createPortal(
                        <Window resizable={false} centered={true} style={{zIndex: 9999}}>
                            <Window.Header>
                                <div style={{display: "flex", width: "100%"}}>
                                    <div style={{flex: 1}}>Bild Zuschneiden</div>
                                    <button
                                        type="button"
                                        className="material-icons"
                                        onClick={() => setOpen(false)}
                                    >
                                        close
                                    </button>
                                </div>
                            </Window.Header>
                            <Window.Content>
                                <div>
                                    <ImageUpload style={{width: "320px", height: "200px"}} value={state}
                                                 onChange={onImageChange} useCrop={true}/>
                                </div>
                            </Window.Content>
                        </Window>
                        , document.getElementById("viewport"))
                )
            }
            <div onClick={() => setOpen(!open && !disabled)} style={{height : "100%"}}>
                {
                    state?.data ? (
                        <img style={{width: "100%", height: "100%"}}
                             src={encodeBase64(state.contentType, state.data)}/>
                    ) : (
                        <div className={"image-placeholder"}>
                            <div>{placeholder}</div>
                        </div>
                    )
                }
            </div>
        </div>
    )

}

namespace Image {
    export interface Attributes {
        name?: string
        value?: Media
        onChange?: (value: Media) => void
        placeholder?: string
        disabled?: boolean
        style?: CSSProperties,
        standalone?: boolean
    }
}

export default Image