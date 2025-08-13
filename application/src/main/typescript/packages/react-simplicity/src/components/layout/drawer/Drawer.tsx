import "./Drawer.css"
import React from "react"
import {classes} from "../../shared/Utils"

function Drawer(properties : Drawer.Attributes) {

    const {open, children, style, className, ...rest} = properties

    return (
        <div
            className={classes(className, "drawer")}
            style={{ display: open ? "block" : "none", ...style }}
            {...rest}
        >
            {children}
        </div>
    )
}

namespace Drawer {

    export interface Attributes {
        children : React.ReactNode
        style? : React.CSSProperties
        className? : string
        open : boolean
    }

    export function Container(properties : Drawer.Container.Attributes) {

        const {children, className, ...rest} = properties

        return (
            <div className={classes(className, "drawer-container")} {...rest}>
                {children}
            </div>
        )
    }

    export namespace Container {

        export interface Attributes {
            className? : string
            style? : React.CSSProperties
            children : React.ReactNode
        }

    }

    export function Content(properties : Drawer.Content.Attributes) {

        const {onClick, children, className, style, ...rest} = properties

        return (
            <div onClick={onClick}
                 className={classes(className, "drawer-content")}
                 {...rest}>
                {children}
            </div>
        )
    }

    export namespace Content {

        export interface Attributes {
            children : React.ReactNode
            className? : string
            style? : React.CSSProperties
            onClick? : React.MouseEventHandler<HTMLDivElement>
        }

    }

}

export default Drawer
