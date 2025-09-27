import Entity from "../../mapper/annotations/Entity";
import Basic from "../../mapper/annotations/Basic";
import {AbstractEntity} from "../container";
import {MetaSignal} from "../../meta-signal/meta-signal";

@Entity("Thumbnail")
export default class Thumbnail extends AbstractEntity {

    override $type = "Thumbnail"

    @Basic({signal: true})
    contentType: MetaSignal<string>

    @Basic({signal: true})
    data: MetaSignal<string>

    @Basic({signal: true})
    name: MetaSignal<string>

}