import {AbstractNode} from "../../core/TreeNode";

export class TokenNode extends AbstractNode {

    text: string | TokenNode[]

    type: string

    index: number

    constructor(content: string | TokenNode[], type: string, index: number) {
        super();
        this.text = content;
        this.type = type;
        this.index = index;
    }
}