import {ActiveObject, Basic, Entity} from "shared";

@Entity("Translation")
export default class Translation extends ActiveObject {

    $type = "Translation"

    @Basic()
    text : string

    @Basic()
    locale : string

}