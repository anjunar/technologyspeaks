import React from "react";
import {marked} from "marked"

function MarkDown(properties : MarkDown.Attributes) {

    let html = marked.parse(properties.children);

    return (
        <div className={"mark-down"} dangerouslySetInnerHTML={{__html : html}}></div>
    )
}

namespace MarkDown {
    export interface Attributes {
        children : string
    }
}

export default MarkDown