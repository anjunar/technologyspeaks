import Entity from "../../mapper/annotations/Entity";
import Basic from "../../mapper/annotations/Basic";
import ActiveObject from "./ActiveObject";

@Entity("Link")
export default class Link {

    $type = "Link"

    @Basic()
    url : string

    @Basic()
    method : string

    @Basic()
    rel : string

    @Basic()
    title : string

    @Basic()
    linkType : string

    @Basic()
    body : ActiveObject

}