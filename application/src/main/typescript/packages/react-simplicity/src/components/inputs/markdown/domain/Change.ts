import { ActiveObject } from "../../../../domain/container"
import {Basic, Entity} from "../../../../mapper"

@Entity("Change")
export default class Change extends ActiveObject {

    @Basic()
    action : string

    @Basic()
    nodeType : string

    @Basic()
    oldValue : string

    @Basic()
    newValue : string

    @Basic()
    value : string

    @Basic()
    offset : number

    get length() : number {
        if (this.value) {
            return this.value.length
        } else {
            return this.newValue.length
        }
    }

}