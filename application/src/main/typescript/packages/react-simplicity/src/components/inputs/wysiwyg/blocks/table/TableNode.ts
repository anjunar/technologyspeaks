import {AbstractContainerNode, AbstractNode} from "../../core/TreeNode";
import Entity from "../../../../../mapper/annotations/Entity";
import Basic from "../../../../../mapper/annotations/Basic";

@Entity("TableCellNode")
export class TableCellNode extends AbstractContainerNode<AbstractNode> {

    $type = "TableCellNode"

    @Basic()
    children: AbstractNode[];

    constructor(children: AbstractNode[] = []) {
        super(children);
    }
}

@Entity("TableRowNode")
export class TableRowNode extends AbstractContainerNode<TableCellNode> {

    $type = "TableRowNode"

    @Basic()
    children: TableCellNode[];

    constructor(children: TableCellNode[] = []) {
        super(children);
    }
}

@Entity("TableNode")
export class TableNode extends AbstractContainerNode<TableRowNode> {

    $type = "TableNode"

    @Basic()
    rows : number = 1

    @Basic()
    cols : number = 2

    @Basic()
    children: TableRowNode[];

    constructor(children: TableRowNode[] = []) {
        super(children);
    }

}