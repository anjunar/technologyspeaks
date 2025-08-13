import React, {CSSProperties} from "react"

function Pages(properties : Pages.Attributes) {

    const {children, page, rendered = true, ...rest} = properties

    if (children) {
        if (rendered) {
            return <div className={"pages"} {...rest}>{children[page]}</div>
        } else {
            return <div className={"pages"} {...rest}>{
                children.map((child, index) => (
                    <div key={index} style={{height : "100%", display : index === page ? "block" : "none"}}>{child}</div>
                ))
            }</div>
        }
    } else {
        return <div className={"pages"}></div>
    }

}

namespace Pages {
    export interface Attributes {
        children : React.ReactElement[]
        page : number
        style? : CSSProperties,
        rendered? : boolean
    }
}

export default Pages
