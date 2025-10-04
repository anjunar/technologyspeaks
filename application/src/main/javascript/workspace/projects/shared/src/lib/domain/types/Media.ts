import Entity from "../../mapper/annotations/Entity";
import Primitive from "../../mapper/annotations/Primitive";
import Thumbnail from "./Thumbnail";
import {MetaSignal} from "../../meta-signal/meta-signal";
import {AbstractEntity} from "../container";
import Reference from "../../mapper/annotations/Reference";

@Entity("Media")
export default class Media extends AbstractEntity {

    override $type = "Media"

    @Primitive({signal : true, type : "string"})
    contentType : MetaSignal<string>

    @Primitive({signal : true, type : "string"})
    data : MetaSignal<string>

    @Primitive({signal : true, type : "string"})
    name : MetaSignal<string>

    @Reference({signal : true, targetEntity : Thumbnail})
    thumbnail: MetaSignal<Thumbnail>

}