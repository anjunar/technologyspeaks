import Entity from "../../mapper/annotations/Entity";
import Basic from "../../mapper/annotations/Basic";
import Thumbnail from "./Thumbnail";
import {MetaSignal} from "../../meta-signal/meta-signal";
import {AbstractEntity} from "../container";
import OneToOne from "../../mapper/annotations/OneToOne";

@Entity("Media")
export default class Media extends AbstractEntity {

    override $type = "Media"

    @Basic({signal : true, type : "string"})
    contentType : MetaSignal<string>

    @Basic({signal : true, type : "string"})
    data : MetaSignal<string>

    @Basic({signal : true, type : "string"})
    name : MetaSignal<string>

    @OneToOne({signal : true, targetEntity : Thumbnail})
    thumbnail: MetaSignal<Thumbnail>

}