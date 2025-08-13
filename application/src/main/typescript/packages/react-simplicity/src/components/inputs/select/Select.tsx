import "./Select.css"
import React, {useCallback, useLayoutEffect, useRef} from "react"
import {Model, Required, Validator} from "../../shared/Model"
import {useInput} from "../../../hooks/UseInputHook";

function Select(properties: Select.Attributes) {

    const {
        children,
        onModel,
        validators,
        dynamicWidth,
        name = "default",
        value,
        standalone = false,
        required,
        disabled = false,
        onChange,
        converter = (value) => value,
        ...rest
    } = properties

    const selectRef = useRef<HTMLSelectElement>(null)

    let [model, state, setState] = useInput(name, value, standalone, "select");

    const onInputListener: React.ChangeEventHandler<HTMLSelectElement> = useCallback((event) => {
        const target = event.target as HTMLSelectElement

        setState(converter(target.value))

        if (onModel) {
            onModel(model)
        }

        if (onChange) {
            onChange(event)
        }

    }, [])

    useLayoutEffect(() => {
        let selectElement = selectRef.current
        selectElement.value = state

        // For form validation -> Error messages
        model.callbacks.push(() => {
            if (onModel) {
                onModel(model)
            }
        })

        if (required) {
            model.addValidator(new Required())
        }

        if (validators) {
            for (const validator of validators) {
                model.addValidator(validator)
            }
        }

        if (onModel) {
            onModel(model)
        }

    }, [])

    useLayoutEffect(() => {
        if (onModel) {
            onModel(model)
        }
    }, [value]);


    return (
        <select ref={selectRef} {...rest} name={name} value={state} onChange={onInputListener} disabled={disabled}
                className={`${model.dirty ? "dirty" : "pristine"} ${model.valid ? "valid" : "error"} ${document.activeElement === selectRef.current ? "focus" : "blur"}`}>
            {children}
        </select>
    )
}

namespace Select {
    export interface Attributes {
        children: React.ReactNode,
        converter?: (value: string) => any
        disabled? : boolean
        dynamicWidth? : boolean
        name?: string,
        onChange?: (event: any) => void
        onModel?: (value: Model) => void,
        required?: boolean,
        standalone?: boolean
        validators?: Validator[]
        value?: any,
    }

    export function Option({children, value} : {children : React.ReactNode, value? : string}) {
        return <option value={value}>{children}</option>
    }
}

export default Select
