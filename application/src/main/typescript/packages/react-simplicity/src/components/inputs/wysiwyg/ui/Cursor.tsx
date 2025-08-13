import "./Cursor.css"
import React, {useContext} from "react"
import {DomContext} from "../contexts/DomState";

function Cursor(properties: Cursor.Attributes) {

    const {cursorRef} = useContext(DomContext)

    return (
        <div style={{display: "none"}} className={"cursor"} ref={cursorRef}></div>
    )
}

namespace Cursor {
    export interface Attributes {}
}

export default Cursor
