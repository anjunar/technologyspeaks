import {AbstractFormatCommand} from "./AbstractCommands";

export class BoldCommand extends AbstractFormatCommand<boolean> {
    format = "bold";
}

export class DeletedCommand extends AbstractFormatCommand<boolean> {
    format = "deleted";
}

export class ItalicCommand extends AbstractFormatCommand<boolean> {
    format = "italic";
}

export class SubCommand extends AbstractFormatCommand<boolean> {
    format = "sub";
}

export class SupCommand extends AbstractFormatCommand<boolean> {
    format = "sup";
}

export class HeadingCommand extends AbstractFormatCommand<string> {
    format = "block";
}

export class FontFamilyCommand extends AbstractFormatCommand<string> {
    format = "fontFamily";
}

export class FontSizeCommand extends AbstractFormatCommand<string> {
    format = "fontSize";
}

export class TextColorCommand extends AbstractFormatCommand<string> {
    format = "color";
}

export class BackgroundColorCommand extends AbstractFormatCommand<string> {
    format = "backgroundColor";
}