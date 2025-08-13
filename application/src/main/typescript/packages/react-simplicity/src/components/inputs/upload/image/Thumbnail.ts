import Entity from "../../../../mapper/annotations/Entity";
import AbstractEntity from "../../../../domain/container/AbstractEntity";
import Basic from "../../../../mapper/annotations/Basic";

@Entity("Thumbnail")
export default class Thumbnail extends AbstractEntity {

    $type = "Thumbnail"

    @Basic()
    name : string

    @Basic()
    contentType : string

    @Basic()
    data : string

}