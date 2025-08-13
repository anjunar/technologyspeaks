import ListProcessor from "./ListProcessor";
import {AbstractProvider} from "../shared/AbstractProvider";
import {ListCommand} from "./ListCommand";
import ListTool from "./ListTool";
import {ListNode} from "./ListNode";

export class ListProvider extends AbstractProvider<typeof ListNode, typeof ListCommand, ListProcessor.Attributes, ListTool.Attributes> {

    type : string = "list"

    icon = "list"

    title = "List"

    node = ListNode;

    command = ListCommand

    processor = ListProcessor

    tool = ListTool

}