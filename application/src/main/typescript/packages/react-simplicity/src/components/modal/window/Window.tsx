import "./Window.css"
import React, {CSSProperties, useContext, useEffect, useLayoutEffect, useRef} from "react"
import {SystemContext, WindowRef} from "../../../System";

function Window(properties: Window.Attributes) {

    const {className, maximized, resizable, draggable, centered, children, taskName = "default", ...rest} = properties

    const elementRef = useRef(document.createElement("div"))

    const systemContext = useContext(SystemContext)

    let header, content, footer
    if (children instanceof Array) {
        header = children.find(child => child.type === Window.Header)
        content = children.find(child => child.type === Window.Content)
        footer = children.find(child => child.type === Window.Footer)
    }

    const dragElementMouseDown : React.MouseEventHandler<HTMLDivElement> = (event) => {
        let element = elementRef.current
        let deltaX = 0,
            deltaY = 0,
            pointerX = 0,
            pointerY = 0

        let elementDrag = (e : MouseEvent) => {
            e.preventDefault()
            deltaX = pointerX - e.clientX
            deltaY = pointerY - e.clientY
            pointerX = e.clientX
            pointerY = e.clientY
            let top = element.offsetTop - deltaY
            if (top < 0) {
                top = 0
            }
            let left = element.offsetLeft - deltaX
            element.style.top = top + "px"
            element.style.left = left + "px"
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

    const nResizeMouseDown: React.MouseEventHandler<HTMLDivElement> = (event) => {
        let element = elementRef.current
        let delta = element.offsetTop,
            pointer = element.offsetTop

        let elementDrag = (event : MouseEvent) => {
            event.preventDefault()
            delta = pointer - event.clientY
            pointer = event.clientY
            element.style.height = element.offsetHeight - 2 + delta + "px"
            element.style.top = element.offsetTop - delta + "px"
        }

        let closeDragElement = () => {
            document.removeEventListener("mouseup", closeDragElement)
            document.removeEventListener("mousemove", elementDrag)
        }

        if (resizable && !maximized) {
            event.preventDefault()
            pointer = event.clientY
            document.addEventListener("mouseup", closeDragElement)
            document.addEventListener("mousemove", elementDrag)
        }
    }

    const nwResizeMouseDown : React.MouseEventHandler<HTMLDivElement> = (event) => {
        let element = elementRef.current
        let deltaY = element.offsetTop,
            pointerY = element.offsetTop
        let deltaX = element.offsetLeft,
            pointerX = element.offsetLeft

        let elementDrag = (event : MouseEvent) => {
            event.preventDefault()
            deltaY = pointerY - event.clientY
            pointerY = event.clientY
            element.style.height = element.offsetHeight - 2 + deltaY + "px"
            element.style.top = element.offsetTop - deltaY + "px"

            deltaX = pointerX - event.clientX
            pointerX = event.clientX
            element.style.width = element.offsetWidth - 2 + deltaX + "px"
            element.style.left = element.offsetLeft - deltaX + "px"
        }

        let closeDragElement = () => {
            document.removeEventListener("mouseup", closeDragElement)
            document.removeEventListener("mousemove", elementDrag)
        }

        if (resizable && !maximized) {
            event.preventDefault()
            pointerY = event.clientY
            pointerX = event.clientX
            document.addEventListener("mouseup", closeDragElement)
            document.addEventListener("mousemove", elementDrag)
        }
    }

    const wResizeMouseDown: React.MouseEventHandler<HTMLDivElement> = (event) => {
        let element = elementRef.current
        let delta = element.offsetLeft,
            pointer = element.offsetLeft

        let elementDrag = (event : MouseEvent) => {
            event.preventDefault()
            delta = pointer - event.clientX
            pointer = event.clientX
            element.style.width = element.offsetWidth - 2 + delta + "px"
            element.style.left = element.offsetLeft - delta + "px"
        }

        let closeDragElement = () => {
            document.removeEventListener("mouseup", closeDragElement)
            document.removeEventListener("mousemove", elementDrag)
        }

        if (resizable && !maximized) {
            event.preventDefault()
            pointer = event.clientX
            document.addEventListener("mouseup", closeDragElement)
            document.addEventListener("mousemove", elementDrag)
        }
    }

    const swResizeMouseDown: React.MouseEventHandler<HTMLDivElement> = (event) => {
        let element = elementRef.current
        let deltaY = element.offsetTop,
            pointerY = element.offsetTop
        let deltaX = element.offsetLeft,
            pointerX = element.offsetLeft

        let elementDrag = (event : MouseEvent) => {
            event.preventDefault()
            deltaY = pointerY - event.clientY
            pointerY = event.clientY
            element.style.height = element.offsetHeight - 2 - deltaY + "px"
            element.style.bottom =
                element.offsetTop + (element.offsetHeight - 2) - deltaY + "px"

            deltaX = pointerX - event.clientX
            pointerX = event.clientX
            element.style.width = element.offsetWidth - 2 + deltaX + "px"
            element.style.left = element.offsetLeft - deltaX + "px"
        }

        let closeDragElement = () => {
            document.removeEventListener("mouseup", closeDragElement)
            document.removeEventListener("mousemove", elementDrag)
        }

        if (resizable && !maximized) {
            event.preventDefault()
            pointerY = event.clientY
            pointerX = event.clientX
            document.addEventListener("mouseup", closeDragElement)
            document.addEventListener("mousemove", elementDrag)
        }
    }

    const neResizeMouseDown : React.MouseEventHandler<HTMLDivElement>= (event) => {
        let element = elementRef.current
        let deltaY = element.offsetTop,
            pointerY = element.offsetTop
        let deltaX = element.offsetLeft,
            pointerX = element.offsetLeft

        let elementDrag = (event : MouseEvent) => {
            event.preventDefault()
            deltaY = pointerY - event.clientY
            pointerY = event.clientY
            element.style.height = element.offsetHeight - 2 + deltaY + "px"
            element.style.top = element.offsetTop - deltaY + "px"

            deltaX = pointerX - event.clientX
            pointerX = event.clientX
            element.style.width = element.offsetWidth - 2 - deltaX + "px"
            element.style.right =
                element.offsetLeft + (element.offsetWidth - 2) - deltaX + "px"
        }

        let closeDragElement = () => {
            document.removeEventListener("mouseup", closeDragElement)
            document.removeEventListener("mousemove", elementDrag)
        }

        if (resizable && !maximized) {
            event.preventDefault()
            pointerY = event.clientY
            pointerX = event.clientX
            document.addEventListener("mouseup", closeDragElement)
            document.addEventListener("mousemove", elementDrag)
        }
    }

    const eResizeMouseDown: React.MouseEventHandler<HTMLDivElement> = (event) => {
        let element = elementRef.current
        let delta = element.offsetLeft,
            pointer = element.offsetLeft

        let elementDrag = (event : MouseEvent) => {
            event.preventDefault()
            delta = pointer - event.clientX
            pointer = event.clientX
            element.style.width = element.offsetWidth - 2 - delta + "px"
            element.style.right =
                element.offsetLeft + (element.offsetWidth - 2) - delta + "px"
        }

        let closeDragElement = () => {
            document.removeEventListener("mouseup", closeDragElement)
            document.removeEventListener("mousemove", elementDrag)
        }

        if (resizable && !maximized) {
            event.preventDefault()
            pointer = event.clientX
            document.addEventListener("mouseup", closeDragElement)
            document.addEventListener("mousemove", elementDrag)
        }
    }

    const seResizeMouseDown: React.MouseEventHandler<HTMLDivElement> = (event) => {
        let element = elementRef.current
        let deltaY = element.offsetTop,
            pointerY = element.offsetTop
        let deltaX = element.offsetLeft,
            pointerX = element.offsetLeft

        let elementDrag = (event : MouseEvent) => {
            event.preventDefault()
            deltaY = pointerY - event.clientY
            pointerY = event.clientY
            element.style.height = element.offsetHeight - 2 - deltaY + "px"
            element.style.bottom =
                element.offsetTop + element.offsetHeight - deltaY + "px"

            deltaX = pointerX - event.clientX
            pointerX = event.clientX
            element.style.width = element.offsetWidth - 2 - deltaX + "px"
            element.style.right =
                element.offsetLeft + (element.offsetWidth - 2) - deltaX + "px"
        }

        let closeDragElement = () => {
            document.removeEventListener("mouseup", closeDragElement)
            document.removeEventListener("mousemove", elementDrag)
        }

        if (resizable && !maximized) {
            event.preventDefault()
            pointerY = event.clientY
            pointerX = event.clientX
            document.addEventListener("mouseup", closeDragElement)
            document.addEventListener("mousemove", elementDrag)
        }
    }

    const sResizeMouseDown: React.MouseEventHandler<HTMLDivElement> = (event) => {
        let element = elementRef.current
        let delta = element.offsetTop,
            pointer = element.offsetTop

        let elementDrag = (event : MouseEvent) => {
            event.preventDefault()
            delta = pointer - event.clientY
            pointer = event.clientY
            element.style.height = element.offsetHeight - 2 - delta + "px"
            element.style.bottom =
                element.offsetTop + (element.offsetHeight - 2) - delta + "px"
        }

        let closeDragElement = () => {
            document.removeEventListener("mouseup", closeDragElement)
            document.removeEventListener("mousemove", elementDrag)
        }

        if (resizable && !maximized) {
            event.preventDefault()
            pointer = event.clientY
            document.addEventListener("mouseup", closeDragElement)
            document.addEventListener("mousemove", elementDrag)
        }
    }

    let headerTemplate
    if (header) {
        headerTemplate = (
            <div className="header" onMouseDown={dragElementMouseDown}>
                {header}
            </div>
        )
    }

    let contentTemplate
    if (content) {
        contentTemplate = <div style={{flex: 1}}>{content}</div>
    } else {
        contentTemplate = <div style={{flex: 1}}>{children}</div>
    }

    let footerTemplate
    if (footer) {
        footerTemplate = <footer>{footer}</footer>
    }

    useLayoutEffect(() => {

        const windowRef = new WindowRef(taskName)

        const [windows, setWindows] = systemContext.windows

        setWindows([...windows, windowRef])

        return () => {
            let indexOf = windows.indexOf(windowRef);
            windows.splice(indexOf, 1)
            setWindows(windows)
        }
    }, []);

    useEffect(() => {
        setTimeout(() => {
            if (centered && elementRef.current) {
                elementRef.current.style.top = `calc(50% - ${elementRef.current
                    .offsetHeight / 2}px)`
                elementRef.current.style.left = `calc(50% - ${elementRef.current
                    .offsetWidth / 2}px)`
            }
        })
    }, [elementRef.current])

    return (
        <div
            className={(className ? className + " " : "") + "window"}
            ref={elementRef}
            {...rest}
        >
            <div
                style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch"
                }}
            >
                {headerTemplate}
                {contentTemplate}
                {footerTemplate}
            </div>

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
                <div></div>
            )}
        </div>
    )
}

namespace Window {
    export interface Attributes {
        tag? : string
        taskName? : string
        children: React.ReactNode
        className?: string
        maximized?: boolean
        resizable?: boolean
        draggable?: boolean
        centered?: boolean
        style? : CSSProperties
        onMouseOver? : any,
        onClick? : (event : React.MouseEvent<HTMLDivElement, MouseEvent>) => void
    }

    export function Content({ children }: {children : React.ReactNode}) {
        return <div style={{height : "100%"}}>{children}</div>
    }

    export function Footer({ children }: {children : React.ReactNode}) {
        return <div>{children}</div>
    }

    export function Header({ children } : {children : React.ReactNode}) {
        return <div style={{ width: "100%" }}>{children}</div>
    }

}

export default Window