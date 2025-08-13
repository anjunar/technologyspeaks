import React, {CSSProperties, useContext, useLayoutEffect, useMemo, useState} from "react"
import {FormContext} from "./Form"
import {ArrayModel, FormModel, Max, Min} from "../../shared";

function FormArray(properties : FormArray.Attributes) {

    const {children, name, min, max, formArrayContext, onCreate, ...rest} = properties

    const context : FormModel = useContext(FormContext)

    const form = useMemo(() => {
        return new ArrayModel(name, context.value)
    }, [])

    const [errors, setErrors] = useState(form.errors)

    const insertNew = () => {
        if (onCreate) {
            if (context.value) {
                let valueElement = context.value[name]
                valueElement.push(onCreate())
            }
        }
    }

    useLayoutEffect(() => {
        form.validate()

        for (const callback of form.callbacks) {
            callback(true)
            setErrors([...form.errors])
        }
    }, [form?.value?.length])

    useLayoutEffect(() => {

        context.registerChildren(form)

        if (formArrayContext) {
            formArrayContext.push(() => {
                for (const callback of form.callbacks) {
                    callback(true)
                    setErrors([...form.errors])
                }
            })
        }

        form.callbacks.push(() => {
            setErrors([...form.errors])
        })

        if (min) {
            form.addValidator(new Min(min))
        }
        if (max) {
            form.addValidator(new Max(max))
        }

        return () => {
            if (context) {
                context.removeChildren(form)
            }
        }
    }, [])

    const generateTitle = () => {
        return errors.map(error => {
            switch (error.type) {
                case "min" : return `Muss mindestens ${error.min} Element(e) enthalten`
                case "max" : return `Darf maximal ${error.max} Element(e) enthalten`
                default : return ""
            }
        }).join(" ")
    }

    return (
        <div className={"form-array"} {...rest}>
            <FormContext.Provider value={form}>
                {children(context.value[name])}
            </FormContext.Provider>
            <div style={{position : "relative"}}>
                <button type={"button"} onClick={() => insertNew()}
                        style={{position : "absolute", right : 0, color : errors.length > 0 ? "var(--color-error)" : "unset"}}
                        title={generateTitle()}
                        className={"material-icons"}>
                    add
                </button>
            </div>

        </div>
    )
}

namespace FormArray {
    export interface Attributes {
        children : (elements : any[]) => React.ReactNode
        name : string
        min? : number
        max? : number
        formArrayContext? : any
        onCreate? : () => any
        style? : CSSProperties
    }
}

export default FormArray
