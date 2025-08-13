import {AbstractProvider} from "../shared/AbstractProvider";
import ImageProcessor from "./ImageProcessor";
import {ImageCommand} from "./ImageCommand";
import ImageTool from "./ImageTool";
import {ImageNode} from "./ImageNode";

export class ImageProvider extends AbstractProvider<typeof ImageNode, typeof ImageCommand, ImageProcessor.Attributes, ImageTool.Attributes> {

    type = "image";
    icon = "image";
    title = "Image";
    node = ImageNode;
    command = ImageCommand;
    processor = ImageProcessor;
    tool = ImageTool;
}