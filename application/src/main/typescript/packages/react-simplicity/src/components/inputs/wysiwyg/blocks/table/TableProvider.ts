import {AbstractProvider} from "../shared/AbstractProvider";
import TableProcessor from "./TableProcessor";
import {TableCommand} from "./TableCommand";
import TableTool from "./TableTool";
import {TableNode} from "./TableNode";

export class TableProvider extends AbstractProvider<typeof TableNode, typeof TableCommand, TableProcessor.Attributes, TableTool.Attributes> {

    title = "Table";
    type = "table";
    command = TableCommand;
    node = TableNode;
    icon = "table";
    processor = TableProcessor;
    tool = TableTool;

}