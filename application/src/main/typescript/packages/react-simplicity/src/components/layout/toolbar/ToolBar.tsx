import "./ToolBar.css"
import React from "react"

function ToolBar(properties : ToolBar.Attributes) {

    const { children, ...rest } = properties

    const keys : any = {}
    if (children instanceof Array) {
        for (const child of children) {
            let element = child
            // @ts-ignore
            let prop = element.props["slot"]
            keys[prop] = child
        }
    } else {
        // @ts-ignore
        let prop = children.props["slot"];
        keys[prop] = children
    }

    return (
        <div className={"toolbar"}>
            <table className={"layout"}>
                <tbody>
                <tr>
                    <td className={"left"}>{keys["left"]}</td>
                    <td className={"middle"} style={{ textAlign: "center" }}>{keys["middle"]}</td>
                    <td className={"right"}>{keys["right"]}</td>
                </tr>
                </tbody>
            </table>
        </div>
    )
}

namespace ToolBar {
    export interface Attributes {
      children : React.ReactNode
    }
}


export default ToolBar