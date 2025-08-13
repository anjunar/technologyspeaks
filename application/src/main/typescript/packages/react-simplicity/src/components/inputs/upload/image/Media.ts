import Entity from "../../../../mapper/annotations/Entity";
import Thumbnail from "./Thumbnail";
import Basic from "../../../../mapper/annotations/Basic";
import AbstractEntity from "../../../../domain/container/AbstractEntity";

@Entity("Media")
export default class Media extends AbstractEntity {

    $type = "Media"

    @Basic()
    name : string

    @Basic()
    contentType : string

    @Basic()
    data : string

    @Basic()
    thumbnail : Thumbnail

}