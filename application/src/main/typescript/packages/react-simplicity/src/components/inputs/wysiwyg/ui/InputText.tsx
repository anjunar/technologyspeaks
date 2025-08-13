import React, {useContext} from "react"
import {DomContext} from "../contexts/DomState";

function InputText(properties: InputText.Attributes) {

    const {} = properties

    const {inputRef} = useContext(DomContext)

    return (
        <textarea ref={inputRef} style={{position: "absolute", right: "0px", top: "0px", height: "1px", width: "1px", opacity: 1}}/>
    )
}

namespace InputText {
    export interface Attributes {

    }
}

export default InputText