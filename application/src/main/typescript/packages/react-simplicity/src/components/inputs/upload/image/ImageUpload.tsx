import "./ImageUpload.css"
import 'react-image-crop/dist/ReactCrop.css'
import React, {CSSProperties, useDeferredValue, useLayoutEffect, useMemo, useRef, useState} from "react"
import Media from "./Media";
import Thumbnail from "./Thumbnail";
import {useInput} from "../../../../hooks/UseInputHook";
import ReactCrop, { type Crop } from 'react-image-crop'

function ImageUpload(properties: ImageUpload.Attributes) {

    const {useCrop = false, name = "default", value, onChange, disabled, placeholder, standalone, ...rest} = properties

    const [model, state, setState] = useInput(name, value, standalone, "image-upload");

    const [crop, setCrop] = useState<Crop>()

    const [position, setPosition] = useState({
        x: 0,
        y: 0,
        height: 100,
        width: 100
    })
    const positionDeferred = useDeferredValue(position)

    const inputRef = useRef(null)
    const imgRef = useRef<HTMLImageElement>(null)

    const croppedImage = useMemo(() => {
        return document.createElement("canvas")
    }, [])

    const createFullContext = (() => {
        if (imgRef.current) {
            let fullImage = document.createElement("canvas")
            fullImage.width = imgRef.current.naturalWidth
            fullImage.height = imgRef.current.naturalHeight
            let fullContext = fullImage.getContext("2d", {willReadFrequently: true})
            fullContext.drawImage(
                imgRef.current,
                0,
                0,
                imgRef.current.naturalWidth,
                imgRef.current.naturalHeight
            )
            return fullContext
        }
    })

    const onClick = () => {
        inputRef.current.click()
    }

    const encodeBase64 = (type: string, data: string) => {
        if (data) {
            return `data:${type};base64,${data}`
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
                        let {type, subType, data} = decodeBase64(result)

                        let image = new Media()
                        image.data = data
                        image.name = file.name
                        image.contentType = type + "/" + subType
                        let thumbnail = new Thumbnail();
                        thumbnail.data = data
                        thumbnail.name = file.name
                        thumbnail.contentType = type + "/" + subType

                        setState(image)

                        if (onChange) {
                            onChange(image)
                        }

                    }
                })

                reader.readAsDataURL(file)
            }
        }
    }


    let doCropping = () => {
        let fullContext = createFullContext();
        if (fullContext) {
            let event = positionDeferred
            let imageElement = imgRef.current
            let offsetLeft = imageElement.offsetLeft
            let offsetTop = imageElement.offsetTop

            let windowLeft = event.x - offsetLeft
            let windowTop = event.y - offsetTop

            let ratioX = imgRef.current.offsetWidth / imgRef.current.naturalWidth
            let ratioY = imgRef.current.offsetHeight / imgRef.current.naturalHeight

            let left = windowLeft / ratioX
            let top = windowTop / ratioX

            let width = event.width / ratioX
            let height = event.height / ratioY

            if (left >= 0 && top >= 0 && width && height) {

                let imageData = fullContext.getImageData(left, top, width, height)

                croppedImage.width = width
                croppedImage.height = height
                let croppedContext = croppedImage.getContext("2d", {
                    willReadFrequently: true
                })
                croppedContext.putImageData(imageData, 0, 0)

                let {type, subType, data} = decodeBase64(croppedImage.toDataURL())

                let image = new Media()
                image.data = state.data
                image.name = state.name
                image.contentType = state.contentType
                let thumbnail = new Thumbnail();
                thumbnail.data = data
                thumbnail.name = state.name
                thumbnail.contentType = type + "/" + subType
                image.thumbnail = thumbnail

                setState(image)

                if (onChange) {
                    onChange(image)
                }

            }

        }
    }

    useLayoutEffect(() => {
        doCropping()
    }, [positionDeferred])

    return (
        <div>
        <div className={"image-upload"} {...rest} onClick={onClick}>
            {state?.data?.length > 0 && !disabled ? (
                <div>
                    {useCrop ? (
                        <ReactCrop crop={crop} onChange={c => setCrop(c)}>
                            <img
                                ref={imgRef}
                                src={encodeBase64(state.contentType, state.data)}
                                onLoadedData={() => doCropping()}
                            />
                        </ReactCrop>
                    ) : ""}
                </div>

            ) : (
                <div className={"image-upload-placeholder"}>
                    <div>{placeholder}</div>
                </div>
            )}
            <input
                ref={inputRef}
                type={"file"}
                onChange={onLoad}
                style={{display: "none"}}
                disabled={disabled}
            />
        </div>
        </div>
    )
}

namespace ImageUpload {
    export interface Attributes {
        useCrop?: boolean
        value?: Media
        name?: string
        onChange?: (value: Media) => void
        disabled?: boolean
        placeholder?: string
        style?: CSSProperties
        standalone?: boolean
    }
}

export default ImageUpload