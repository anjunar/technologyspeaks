import {AbstractProvider} from "../shared/AbstractProvider";
import {CodeCommand} from "./CodeCommand";
import CodeProcessor from "./CodeProcessor";
import CodeTool from "./CodeTool";
import {CodeNode} from "./CodeNode";

export class CodeProvider extends AbstractProvider<typeof CodeNode, typeof CodeCommand, CodeProcessor.Attributes, CodeTool.Attributes> {

    command = CodeCommand

    node = CodeNode;

    icon = "code"

    processor = CodeProcessor

    title = "Code"

    tool = CodeTool

    type = "code"



}