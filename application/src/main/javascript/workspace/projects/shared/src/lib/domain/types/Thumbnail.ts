import Entity from "../../mapper/annotations/Entity";
import Primitive from "../../mapper/annotations/Primitive";
import {AbstractEntity} from "../container";
import {MetaSignal} from "../../meta-signal/meta-signal";

@Entity("Thumbnail")
export default class Thumbnail extends AbstractEntity {

    override $type = "Thumbnail"

    @Primitive({signal: true})
    contentType: MetaSignal<string>

    @Primitive({signal: true})
    data: MetaSignal<string>

    @Primitive({signal: true})
    name: MetaSignal<string>

}