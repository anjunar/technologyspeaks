import "./VideoUpload.css"
import React, {Fragment, useContext, useLayoutEffect, useMemo, useRef, useState} from "react"
import {FormModel, Model} from "../../../shared/Model"
import {FormContext} from "../../form/Form"

function VideoUpload(properties: VideoUpload.Attributes) {

    const {
        name,
        disabled,
        placeholder,
        onSnapshot,
        width,
        height,
        ...rest
    } = properties

    const [state, setState] = useState({
        data: "",
        lastModified: 0,
        name: "",
        type: ""
    })

    const model = useMemo(() => {
        if (name) {
            return new Model(name, state, "video")
        }
        throw new Error("Could not get name for component")
    }, [])

    const context : FormModel = useContext(FormContext)

    const videoRef = useRef(document.createElement("video"))
    const inputRef = useRef(document.createElement("input"))

    const generateVideoThumbnail = (video : any) => {
        const canvas = document.createElement("canvas")

        let ctx = canvas.getContext("2d")
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
        video.pause()
        return canvas.toDataURL("image/png")
    }

    const snapshot = (event : any) => {
        event.stopPropagation()

        let data = generateVideoThumbnail(videoRef.current)

        if (onSnapshot) {
            onSnapshot({
                data: data,
                lastModified: Date.now().valueOf(),
                name: "thumbnail_" + state.name,
                type: "image/png"
            })
        }
    }

    const onInputChange = (event : any) => {
        let input = event.target
        if (input.files) {
            let file = input.files[0]
            let reader = new FileReader()
            reader.onload = e => {
                if (reader.result) {
                    setState({
                        name: file.name,
                        lastModified: file.lastModified,
                        type: file.type,
                        data: reader.result as string
                    })
                }
            }
            reader.readAsDataURL(file)
        }
    }

    useLayoutEffect(() => {
        if (context) {
            context.registerInput(model)
        }

        model.callbacks.push(() => {
            setState(model.value)
        })
        return () => {
            if (context) {
                context.removeInput(model)
            }
        }
    }, [])

    return (
        <div
            style={{position: "relative"}}
            onClick={() => inputRef.current.click()}
            {...rest}
        >
            {state.data.length > 0 ? (
                <Fragment>
                    <video
                        ref={videoRef}
                        src={state.data}
                        style={{width: "100%", height: "100%"}}
                        controls
                    />
                    {disabled ? (
                        ""
                    ) : (
                        <button
                            className={"material-icons"}
                            style={{position: "absolute", top: "10px", left: "10px"}}
                            type={"button"}
                            onClick={snapshot}
                        >
                            photo_camera
                        </button>
                    )}
                </Fragment>
            ) : (
                <div className={"center"}>{placeholder}</div>
            )}
            <input
                ref={inputRef}
                type={"file"}
                onChange={onInputChange}
                style={{display: "none"}}
                disabled={disabled}
            />
        </div>
    )
}

namespace VideoUpload {
    export interface Attributes {
        name? : string
        disabled? : boolean
        placeholder? : string
        onSnapshot? : any
        width? : number
        height? : number
    }
}

export default VideoUpload
