import {AbstractContainerNode, AbstractNode} from "../../core/TreeNode";
import Entity from "../../../../../mapper/annotations/Entity";
import Basic from "../../../../../mapper/annotations/Basic";

@Entity("ListNode")
export class ListNode extends AbstractContainerNode<ItemNode> {

    $type = "ListNode"

    @Basic()
    children: ItemNode[];

    constructor(children: ItemNode[] = []) {
        super(children);
    }
}

@Entity("ItemNode")
export class ItemNode extends AbstractContainerNode<AbstractNode> {

    $type = "ItemNode"

    @Basic()
    children: AbstractNode[];

    constructor(children: AbstractNode[] = []) {
        super(children);
    }
}