import "./Caption.css"
import React, {CSSProperties, MutableRefObject, useEffect, useRef} from "react"
import Media from "../Media";

function Caption(properties: Caption.Attributes) {

    const {
        state,
        onMove,
        imageRef,
        className,
        keepRatio = true,
        maximized,
        resizable = true,
        draggable = true,
        centered = true,
        ...rest
    } = properties

    const elementRef = useRef(null)

    const dragElementMouseDown : React.MouseEventHandler<HTMLDivElement> = (event) => {
        let element = elementRef.current
        let image = imageRef.current

        let deltaX = 0,
            deltaY = 0,
            pointerX = 0,
            pointerY = 0

        let elementDrag = (e : MouseEvent)  => {
            e.stopPropagation()
            deltaX = pointerX - e.clientX
            deltaY = pointerY - e.clientY
            pointerX = e.clientX
            pointerY = e.clientY
            let width = element.offsetWidth
            let height = element.offsetHeight

            let top = element.offsetTop - deltaY
            let left = element.offsetLeft - deltaX

            if (top < 0) {
                top = 0
            }
            if (left - image.offsetLeft < 0) {
                left = image.offsetLeft
            }
            if (
                left + width >
                image.offsetWidth + image.offsetLeft
            ) {
                left =
                    image.offsetWidth + image.offsetLeft - width
            }
            if (top + height > image.offsetHeight) {
                top = image.offsetHeight - height
            }
            element.style.top = top + "px"
            element.style.left = left + "px"

            if (onMove) {
                onMove({
                    x: left,
                    y: top,
                    width: width,
                    height: height
                })
            }
        }

        let closeDragElement = () => {
            document.removeEventListener("mouseup", closeDragElement)
            document.removeEventListener("mousemove", elementDrag)
        }

        if (!maximized && draggable) {
            event.preventDefault()
            pointerX = event.clientX
            pointerY = event.clientY
            document.addEventListener("mouseup", closeDragElement)
            document.addEventListener("mousemove", elementDrag)
        }
    }

    const nResizeMouseDown : React.MouseEventHandler<HTMLDivElement> = (event)  => {
        let element = elementRef.current
        let delta = element.offsetTop,
            pointer = element.offsetTop

        let elementDrag = (event : MouseEvent)  => {
            event.preventDefault()
            delta = pointer - event.clientY
            pointer = event.clientY
            element.style.height = element.offsetHeight + delta + "px"
            element.style.top = element.offsetTop - delta + "px"
            if (keepRatio) {
                element.style.width = element.offsetWidth + delta + "px"
                element.style.right =
                    element.offsetLeft + element.offsetWidth + delta + "px"
            }
        }

        let closeDragElement = () => {
            document.removeEventListener("mouseup", closeDragElement)
            document.removeEventListener("mousemove", elementDrag)
        }

        if (resizable && !maximized) {
            event.stopPropagation()
            event.preventDefault()
            pointer = event.clientY
            document.addEventListener("mouseup", closeDragElement)
            document.addEventListener("mousemove", elementDrag)
        }
    }

    const nwResizeMouseDown  : React.MouseEventHandler<HTMLDivElement> = (event)  => {
        let element = elementRef.current
        let deltaY = element.offsetTop,
            pointerY = element.offsetTop
        let deltaX = element.offsetLeft,
            pointerX = element.offsetLeft

        let elementDrag = (event : MouseEvent)  => {
            event.preventDefault()
            deltaY = pointerY - event.clientY
            pointerY = event.clientY
            element.style.height = element.offsetHeight + deltaY + "px"
            element.style.top = element.offsetTop - deltaY + "px"

            if (keepRatio) {
                deltaX = deltaY
                pointerX = event.clientX
                element.style.width = element.offsetWidth + deltaX + "px"
                element.style.left = element.offsetLeft - deltaX + "px"
            } else {
                deltaX = pointerX - event.clientX
                pointerX = event.clientX
                element.style.width = element.offsetWidth + deltaX + "px"
                element.style.left = element.offsetLeft - deltaX + "px"
            }
        }

        let closeDragElement = () => {
            document.removeEventListener("mouseup", closeDragElement)
            document.removeEventListener("mousemove", elementDrag)
        }

        if (resizable && !maximized) {
            event.preventDefault()
            event.stopPropagation()
            pointerY = event.clientY
            pointerX = event.clientX
            document.addEventListener("mouseup", closeDragElement)
            document.addEventListener("mousemove", elementDrag)
        }
    }

    const wResizeMouseDown : React.MouseEventHandler<HTMLDivElement> = (event)  => {
        let element = elementRef.current
        let delta = element.offsetLeft,
            pointer = element.offsetLeft

        let elementDrag = (event : MouseEvent)  => {
            event.preventDefault()
            delta = pointer - event.clientX
            pointer = event.clientX
            element.style.width = element.offsetWidth + delta + "px"
            element.style.left = element.offsetLeft - delta + "px"

            if (keepRatio) {
                element.style.height = element.offsetHeight + delta + "px"
                element.style.top = element.offsetTop - delta + "px"
            }
        }

        let closeDragElement = () => {
            document.removeEventListener("mouseup", closeDragElement)
            document.removeEventListener("mousemove", elementDrag)
        }

        if (resizable && !maximized) {
            event.preventDefault()
            event.stopPropagation()
            pointer = event.clientX
            document.addEventListener("mouseup", closeDragElement)
            document.addEventListener("mousemove", elementDrag)
        }
    }

    const swResizeMouseDown : React.MouseEventHandler<HTMLDivElement> = (event)  => {
        let element = elementRef.current
        let deltaY = element.offsetTop,
            pointerY = element.offsetTop
        let deltaX = element.offsetLeft,
            pointerX = element.offsetLeft

        let elementDrag = (event : MouseEvent)  => {
            event.preventDefault()
            deltaY = pointerY - event.clientY
            pointerY = event.clientY
            element.style.height = element.offsetHeight - deltaY + "px"
            element.style.bottom =
                element.offsetTop + element.offsetHeight - deltaY + "px"

            if (keepRatio) {
                deltaX = -deltaY
                pointerX = event.clientX
                element.style.width = element.offsetWidth + deltaX + "px"
                element.style.left = element.offsetLeft - deltaX + "px"
            } else {
                deltaX = pointerX - event.clientX
                pointerX = event.clientX
                element.style.width = element.offsetWidth + deltaX + "px"
                element.style.left = element.offsetLeft - deltaX + "px"
            }
        }

        let closeDragElement = () => {
            document.removeEventListener("mouseup", closeDragElement)
            document.removeEventListener("mousemove", elementDrag)
        }

        if (resizable && !maximized) {
            event.preventDefault()
            event.stopPropagation()
            pointerY = event.clientY
            pointerX = event.clientX
            document.addEventListener("mouseup", closeDragElement)
            document.addEventListener("mousemove", elementDrag)
        }
    }

    const neResizeMouseDown : React.MouseEventHandler<HTMLDivElement> = (event)  => {
        let element = elementRef.current
        let deltaY = element.offsetTop,
            pointerY = element.offsetTop
        let deltaX = element.offsetLeft,
            pointerX = element.offsetLeft

        let elementDrag = (event : MouseEvent)  => {
            event.preventDefault()
            deltaY = pointerY - event.clientY
            pointerY = event.clientY
            element.style.height = element.offsetHeight + deltaY + "px"
            element.style.top = element.offsetTop - deltaY + "px"

            if (keepRatio) {
                deltaX = deltaY
                pointerX = event.clientX
                element.style.right =
                    element.offsetLeft + element.offsetWidth + deltaX + "px"
                element.style.width = element.offsetWidth + deltaX + "px"
            } else {
                deltaX = pointerX - event.clientX
                pointerX = event.clientX
                element.style.right =
                    element.offsetLeft + element.offsetWidth - deltaX + "px"
                element.style.width = element.offsetWidth - deltaX + "px"
            }
        }

        let closeDragElement = () => {
            document.removeEventListener("mouseup", closeDragElement)
            document.removeEventListener("mousemove", elementDrag)
        }

        if (resizable && !maximized) {
            event.preventDefault()
            event.stopPropagation()
            pointerY = event.clientY
            pointerX = event.clientX
            document.addEventListener("mouseup", closeDragElement)
            document.addEventListener("mousemove", elementDrag)
        }
    }

    const eResizeMouseDown : React.MouseEventHandler<HTMLDivElement> = (event)  => {
        let element = elementRef.current
        let delta = element.offsetLeft,
            pointer = element.offsetLeft

        let elementDrag = (event : MouseEvent)  => {
            event.preventDefault()
            delta = pointer - event.clientX
            pointer = event.clientX
            element.style.width = element.offsetWidth - delta + "px"
            element.style.right =
                element.offsetLeft + element.offsetWidth - delta + "px"

            if (keepRatio) {
                element.style.height = element.offsetHeight - delta + "px"
                element.style.bottom =
                    element.offsetTop + element.offsetHeight - delta + "px"
            }
        }

        let closeDragElement = () => {
            document.removeEventListener("mouseup", closeDragElement)
            document.removeEventListener("mousemove", elementDrag)
        }

        if (resizable && !maximized) {
            event.preventDefault()
            event.stopPropagation()
            pointer = event.clientX
            document.addEventListener("mouseup", closeDragElement)
            document.addEventListener("mousemove", elementDrag)
        }
    }

    const seResizeMouseDown : React.MouseEventHandler<HTMLDivElement> = (event)  => {
        let element = elementRef.current
        let deltaY = element.offsetTop,
            pointerY = element.offsetTop
        let deltaX = element.offsetLeft,
            pointerX = element.offsetLeft

        let elementDrag = (event : MouseEvent)  => {
            event.preventDefault()
            deltaY = pointerY - event.clientY
            pointerY = event.clientY
            element.style.height = element.offsetHeight - deltaY + "px"
            element.style.bottom =
                element.offsetTop + element.offsetHeight - deltaY + "px"

            if (keepRatio) {
                deltaX = deltaY
                pointerX = event.clientX
                element.style.width = element.offsetWidth - deltaX + "px"
                element.style.right =
                    element.offsetLeft + element.offsetWidth - deltaX + "px"
            } else {
                deltaX = pointerX - event.clientX
                pointerX = event.clientX
                element.style.width = element.offsetWidth - deltaX + "px"
                element.style.right =
                    element.offsetLeft + element.offsetWidth - deltaX + "px"
            }
        }

        let closeDragElement = () => {
            document.removeEventListener("mouseup", closeDragElement)
            document.removeEventListener("mousemove", elementDrag)
        }

        if (resizable && !maximized) {
            event.preventDefault()
            event.stopPropagation()
            pointerY = event.clientY
            pointerX = event.clientX
            document.addEventListener("mouseup", closeDragElement)
            document.addEventListener("mousemove", elementDrag)
        }
    }

    const sResizeMouseDown : React.MouseEventHandler<HTMLDivElement> = (event)  => {
        let element = elementRef.current
        let delta = element.offsetTop,
            pointer = element.offsetTop

        let elementDrag = (event : MouseEvent)  => {
            event.preventDefault()
            delta = pointer - event.clientY
            pointer = event.clientY
            element.style.height = element.offsetHeight - delta + "px"
            element.style.bottom =
                element.offsetTop + element.offsetHeight - delta + "px"

            if (keepRatio) {
                element.style.width = element.offsetWidth - delta + "px"
                element.style.left = element.offsetLeft + delta + "px"
            }
        }

        let closeDragElement = () => {
            document.removeEventListener("mouseup", closeDragElement)
            document.removeEventListener("mousemove", elementDrag)
        }

        if (resizable && !maximized) {
            event.preventDefault()
            event.stopPropagation()
            pointer = event.clientY
            document.addEventListener("mouseup", closeDragElement)
            document.addEventListener("mousemove", elementDrag)
        }
    }

    useEffect(() => {
        let element = elementRef.current

        onMove({
            x: element.offsetLeft,
            y: element.offsetTop,
            width: element.offsetWidth,
            height: element.offsetHeight
        })

        setTimeout(() => {
            if (centered) {
                elementRef.current.style.top = `calc(50% - ${elementRef.current
                    .offsetHeight / 2}px)`
                elementRef.current.style.left = `calc(50% - ${elementRef.current
                    .offsetWidth / 2}px)`

                if (onMove) {
                    let element = elementRef.current

                    onMove({
                        x: element.offsetLeft,
                        y: element.offsetTop,
                        width: element.offsetWidth,
                        height: element.offsetHeight
                    })
                }

            }
        }, 200)
    }, [state.data])

    return (
        <div
            className={(className ? className + " " : "") + "caption"}
            ref={elementRef}
            {...rest}
            onMouseDown={dragElementMouseDown}
        >
            {resizable ? (
                <div>
                    <div className="se" onMouseDown={seResizeMouseDown}></div>
                    <div className="sw" onMouseDown={swResizeMouseDown}></div>
                    <div className="nw" onMouseDown={nwResizeMouseDown}></div>
                    <div className="ne" onMouseDown={neResizeMouseDown}></div>
                    <div className="n" onMouseDown={nResizeMouseDown}></div>
                    <div className="s" onMouseDown={sResizeMouseDown}></div>
                    <div className="w" onMouseDown={wResizeMouseDown}></div>
                    <div className="e" onMouseDown={eResizeMouseDown}></div>
                </div>
            ) : (
                ""
            )}
        </div>
    )
}

namespace Caption {
    export interface Attributes {
        state : Media
        onMove? : any
        imageRef : MutableRefObject<HTMLImageElement>
        className? :string
        keepRatio? : boolean
        maximized? :boolean
        resizable? :boolean
        draggable?: boolean
        centered?:boolean
        onClick? : any
        style? : CSSProperties
    }
}

export default Caption