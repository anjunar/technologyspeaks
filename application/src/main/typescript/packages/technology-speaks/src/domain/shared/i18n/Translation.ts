import {ActiveObject, Basic, Entity} from "react-ui-simplicity";

@Entity("Translation")
export default class Translation extends ActiveObject {

    $type = "Translation"

    @Basic()
    text : string

    @Basic()
    locale : string

}