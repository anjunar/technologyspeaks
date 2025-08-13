import {registerClass} from "../Registry"

export default function Entity(name : string) {
    return function (target : any) {
        registerClass(name, target)
    }
}