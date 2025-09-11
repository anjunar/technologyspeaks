import {useEffect, useState} from "react";
import {debounce} from "../components/shared/Utils";
import {objectMembrane} from "../membrane/Membrane";

export function useForm<T>(object: T | (() => T)): T {
    let entity;
    if (object instanceof Function) {
        entity = object()
    } else {
        entity = object
    }

    const [state, setState] = useState(() => {
        let callbacks = [debounce(() => {
            setState(objectMembrane(entity, callbacks))
        }, 30)];
        return objectMembrane(entity, callbacks)
    })

    return state
}
