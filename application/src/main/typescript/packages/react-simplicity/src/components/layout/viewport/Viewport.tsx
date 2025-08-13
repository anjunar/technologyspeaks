import "./Viewport.css"
import React, {useRef} from "react"


function Viewport(properties: Viewport.Attributes) {

    const {children, ...rest} = properties

    const viewport = useRef(null)

    return (
        <div id={"viewport"} className={"viewport"} ref={viewport} {...rest}>
            {children}
        </div>
    )
}

export class Service {

    viewPort: React.MutableRefObject<HTMLDivElement>

    constructor(viewPort: React.MutableRefObject<HTMLDivElement>) {
        this.viewPort = viewPort
    }

    get offsetHeight() {
        return this.viewPort.current.offsetHeight
    }

    get offsetWidth() {
        return this.viewPort.current.offsetWidth
    }

    isClientRectInBounds(element: HTMLDivElement) {
        let windowBoundingClientRect = element.getBoundingClientRect()
        let viewPortClientRect = this.viewPort.current.getBoundingClientRect()
        return (
            windowBoundingClientRect.top + windowBoundingClientRect.height <
            viewPortClientRect.top + viewPortClientRect.height
        )
    }
}

namespace Viewport {
    export interface Attributes {
        children: React.ReactNode
    }
}

export default Viewport
