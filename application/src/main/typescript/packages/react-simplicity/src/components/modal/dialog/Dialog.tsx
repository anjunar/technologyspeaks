import "./Dialog.css"
import React from "react"

export default function Dialog({ children, ...rest } : {children : React.ReactNode} ) {

    return (
        <div className={"modal"} {...rest}>
            {children}
        </div>
    )
}
