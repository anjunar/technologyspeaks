import {registerClass} from "../Registry"

export default function MappedSuperclass(name : string) {
    return function (target : any) {
        registerClass(name, target)
    }
}