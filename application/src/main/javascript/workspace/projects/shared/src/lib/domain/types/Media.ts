import Entity from "../../mapper/annotations/Entity";
import Basic from "../../mapper/annotations/Basic";
import Thumbnail from "./Thumbnail";
import {MetaSignal} from "../../meta-signal/meta-signal";
import {AbstractEntity} from "../container";

@Entity("Media")
export default class Media extends AbstractEntity {

    override $type = "Media"

    @Basic({signal : true})
    contentType : MetaSignal<string>

    @Basic({signal : true})
    data : MetaSignal<string>

    @Basic({signal : true})
    name : MetaSignal<string>

    @Basic({signal : true})
    thumbnail: MetaSignal<Thumbnail>

}