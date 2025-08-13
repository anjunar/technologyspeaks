import "./SubForm.css"
import React, {CSSProperties, useContext, useLayoutEffect, useMemo} from "react"
import {FormContext} from "./Form"
import {ArrayModel, FormModel} from "../../shared/Model";

function SubForm(properties : SubForm.Attributes) {

    const { children, style, index = -1, subType, name, ...rest } = properties

    const context : FormModel & ArrayModel = useContext(FormContext)

    const form = useMemo(() => {
        let subValue = name ? context.value[name] : context.value
        return new FormModel(name, subValue instanceof Array ? subValue[index] : subValue)
    }, [])

    useLayoutEffect(() => {

        if (context instanceof ArrayModel) {
            context.registerData(form)
        }

        if (context instanceof FormModel) {
            context.registerChildren(form)
        }

        return () => {
            if (context instanceof ArrayModel) {
                context.removeData(form)
            }
            if (context instanceof FormModel) {
                context.removeChildren(form)
            }
        }
    }, [])

    return (
        <fieldset {...rest} className={"sub-form"} style={style}>
            <FormContext.Provider value={form}>{children}</FormContext.Provider>
        </fieldset>
    )
}

namespace SubForm {
    export interface Attributes {
        children : React.ReactNode
        index? : number
        subType? : string
        name? : string,
        style? : CSSProperties
    }
}

export default SubForm