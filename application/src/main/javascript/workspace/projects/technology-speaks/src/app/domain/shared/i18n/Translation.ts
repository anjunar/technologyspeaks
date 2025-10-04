import {ActiveObject, Primitive, Entity} from "shared";

@Entity("Translation")
export default class Translation extends ActiveObject {

    override $type = "Translation"

    @Primitive()
    text : string

    @Primitive()
    locale : string

}