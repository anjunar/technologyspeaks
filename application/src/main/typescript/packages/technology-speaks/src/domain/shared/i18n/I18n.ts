import {AbstractEntity, Basic, Entity} from "shared";
import Translation from "./Translation";

@Entity("I18n")
export default class I18n extends AbstractEntity {
    $type = "I18n"

    @Basic()
    text : string

    @Basic()
    translations : Translation[]
}