import {FormModel, Model} from "../components/shared/Model";
import {useContext, useLayoutEffect, useMemo} from "react";
import {FormContext} from "../components/inputs/form/Form";

export function useInput<E>(name : string = "default", value : E, standalone? : boolean, type? : string) : [Model, E, (value : E) => void] {

    let state = value

    const context : FormModel = useContext(FormContext)

    if (context && ! standalone) {
        state = context.value[name]
    }

    const model = useMemo(() => {
        if (context && !standalone) {
            return new Model(name, context.value, type)
        } else {
            return new Model(name, {[name] : value}, type)
        }
    }, [])

    function setState(value : E) {
        state = value
        model.value = value

        model.validate()
        model.fireCallbacks(true)
    }

    useLayoutEffect(() => {
        if (standalone) {
            model.value = value
        }
    }, [value]);

    useLayoutEffect(() => {
        if (context) {
            context.registerInput(model)
        }

        return () => {
            if (context) {
                context.removeInput(model)
            }
        }
    }, []);

    return [model, state, setState]


}