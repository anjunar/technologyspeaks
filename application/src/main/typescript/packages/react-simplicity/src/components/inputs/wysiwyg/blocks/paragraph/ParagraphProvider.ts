import {AbstractProvider} from "../shared/AbstractProvider";
import ParagraphProcessor from "./ParagraphProcessor";
import ParagraphTool from "./ParagraphTool";
import {ParagraphCommand} from "./ParagraphCommand";
import {ParagraphNode} from "./ParagraphNode";

export class ParagraphProvider extends AbstractProvider<typeof ParagraphNode, typeof ParagraphCommand, ParagraphProcessor.Attributes, ParagraphTool.Attributes> {

    command = ParagraphCommand

    icon: string = "abc"

    processor = ParagraphProcessor

    node = ParagraphNode;

    title = "Paragraph"

    tool = ParagraphTool

    type = "p"


}