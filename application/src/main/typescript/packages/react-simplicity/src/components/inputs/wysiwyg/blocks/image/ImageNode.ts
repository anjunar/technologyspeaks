import {AbstractNode} from "../../core/TreeNode";
import Basic from "../../../../../mapper/annotations/Basic";
import {Entity} from "../../../../../mapper";

@Entity("ImageNode")
export class ImageNode extends AbstractNode {

    $type = "ImageNode"

    @Basic()
    src : string = ""

    @Basic()
    type : string

    @Basic()
    subType : string

    @Basic()
    aspectRatio : number = 1

    @Basic()
    width : number = 360

    @Basic()
    height : number = 360
}