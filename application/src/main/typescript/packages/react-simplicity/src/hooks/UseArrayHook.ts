import {useState} from "react";
import {debounce} from "../components/shared/Utils";
import {arrayMembrane} from "../membrane/Membrane";
import ActiveObject from "../domain/container/ActiveObject";
import LinkContainerObject from "../domain/container/LinkContainerObject";
import ObjectDescriptor from "../domain/descriptors/ObjectDescriptor";

export function useArray<T extends ActiveObject>(object: [T[], number, LinkContainerObject, ObjectDescriptor, (path : string[], value : any) => void]) : [T[], number, LinkContainerObject, ObjectDescriptor, (path : string[], value : any) => void] {
    let [entity, size, links, schema, callbacks] = object

    const [state, setState] = useState(() => {
        let inner = debounce(() => {
            setState(arrayMembrane(entity, [inner, callbacks], undefined))
        }, 30);
        return arrayMembrane(entity, [inner, callbacks], undefined)
    })

    return [state, size, links, schema, callbacks]
}
