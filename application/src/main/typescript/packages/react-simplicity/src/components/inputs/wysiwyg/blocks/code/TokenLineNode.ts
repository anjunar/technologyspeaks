import {AbstractContainerNode} from "../../core/TreeNode";
import {TokenNode} from "./TokenNode";
import Entity from "../../../../../mapper/annotations/Entity";

@Entity("TokenLineNode")
export class TokenLineNode extends AbstractContainerNode<TokenNode> {

    children: TokenNode[];

    constructor(children: TokenNode[]) {
        super(children);
    }
}