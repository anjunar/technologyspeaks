import Entity from "../../mapper/annotations/Entity";
import Primitive from "../../mapper/annotations/Primitive";
import ActiveObject from "./ActiveObject";

@Entity("Link")
export default class Link {

    $type = "Link"

    @Primitive()
    url : string

    @Primitive()
    method : string

    @Primitive()
    rel : string

    @Primitive()
    title : string

    @Primitive()
    linkType : string

    @Primitive()
    body : ActiveObject

}