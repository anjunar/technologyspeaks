import {AbstractEntity, Primitive, Entity} from "shared";
import Translation from "./Translation";

@Entity("I18n")
export default class I18n extends AbstractEntity {
    override $type = "I18n"

    @Primitive()
    text : string

    @Primitive()
    translations : Translation[]
}