import "./Toolbar.css"
import React, {useContext} from "react"
import FormatButton from "./toolbar/FormatButton";
import FormatSelect from "./toolbar/FormatSelect";
import {AbstractNode, TextNode} from "../core/TreeNode";
import {BackgroundColorCommand, BoldCommand, DeletedCommand, FontFamilyCommand, FontSizeCommand, HeadingCommand, ItalicCommand, SubCommand, SupCommand, TextColorCommand} from "../commands/FormatCommands";
import Pages from "../../../layout/pages/Pages";
import Page from "../../../layout/pages/Page";
import {JustifyCommand} from "../commands/JustifyCommand";
import ActionButton from "./toolbar/ActionButton";
import {AbstractProvider} from "../blocks/shared/AbstractProvider";
import {EditorContext} from "../contexts/EditorState";
import MarkDownEditor, {MarkDownContext} from "../../markdown/MarkDownEditor";

const colors = [
    /*
        "--color-text",
        "--color-background-primary",
        "--color-background-secondary",
        "--color-background-tertiary",
        "--color-warning",
        "--color-error",
        "--color-selected",
    */
    "--color-theme-amber",
    "--color-theme-blue",
    "--color-theme-cyan",
    "--color-theme-emerald",
    "--color-theme-fuchsia",
    "--color-theme-green",
    "--color-theme-indigo",
    "--color-theme-lime",
    "--color-theme-orange",
    "--color-theme-pink",
    "--color-theme-purple",
    "--color-theme-red",
    "--color-theme-rose",
    "--color-theme-sky",
    "--color-theme-slate",
    "--color-theme-teal",
    "--color-theme-violet",
    "--color-theme-yellow",
    "--color-theme-zinc"
]

function Toolbar(properties: Toolbar.Attributes) {

    const {page, onPage} = properties

    const {cursor: {currentCursor}, providers} = useContext(EditorContext)

    function onBlockCallback(node: AbstractNode): string {
        if (node instanceof TextNode) {
            return node.block
        }
        return "p"
    }

    return (
        <div style={{display: "flex", justifyContent: "space-between"}}>
            <button className={"material-icons"} onClick={() => onPage(page - 1 === -1 ? 4 : page - 1)}>arrow_left</button>
            <Pages page={page}>
                <Page>
                    <div className={"editor-toolbar"}>
                        <FormatSelect callback={onBlockCallback} command={new HeadingCommand()}>
                            <option value={"h1"}>H1</option>
                            <option value={"h2"}>H2</option>
                            <option value={"h3"}>H3</option>
                            <option value={"h4"}>H4</option>
                            <option value={"h5"}>H5</option>
                            <option value={"h6"}>H6</option>
                            <option value={"p"}>Paragraph</option>
                        </FormatSelect>
                        <FormatButton command={new BoldCommand()} callback={node => node.bold}>format_bold</FormatButton>
                        <FormatButton command={new ItalicCommand()} callback={node => node.italic}>format_italic</FormatButton>
                        <FormatButton command={new DeletedCommand()} callback={node => node.deleted}>strikethrough_s</FormatButton>
                        <FormatButton command={new SubCommand()} callback={node => node.sub}>subscript</FormatButton>
                        <FormatButton command={new SupCommand()} callback={node => node.sup}>superscript</FormatButton>
                    </div>
                </Page>
                <Page>
                    <div className={"editor-toolbar"}>
                        <FormatSelect command={new FontFamilyCommand()} callback={node => node.fontFamily}>
                            <option value="Georgia, serif">Georgia</option>
                            <option value="Palatino Linotype, serif">Palatino</option>
                            <option value="Arial, serif">Arial</option>
                            <option value="Comic Sans MS, serif">Comic Sans</option>
                            <option value="Helvetica, serif">Helvetica</option>
                            <option value="Impact, serif">Impact</option>
                            <option value="Lucida, serif">Lucida</option>
                            <option value="Tahoma, serif">Tahoma</option>
                            <option value="Trebuchet MS, serif">Trebuchet</option>
                            <option value="Verdana, serif">Verdana</option>
                            <option value="Courier New, serif">Couria New</option>
                            <option value="Lucida Console, serif">Lucida</option>
                        </FormatSelect>
                        <FormatSelect command={new JustifyCommand()} callback={node => node.parent.justify}>
                            <option value={"justify"}>Justify</option>
                            <option value={"justify-left"}>Left</option>
                            <option value={"justify-right"}>Right</option>
                            <option value={"justify-center"}>Center</option>
                        </FormatSelect>
                        <FormatSelect command={new FontSizeCommand()} callback={node => node.fontSize}>
                            <option value="xx-small">xx-small</option>
                            <option value="x-small">x-small</option>
                            <option value="small">small</option>
                            <option value="medium">medium</option>
                            <option value="large">large</option>
                            <option value="x-large">x-large</option>
                            <option value="xx-large">xx-large</option>
                        </FormatSelect>
                    </div>
                </Page>
                <Page>
                    <div className={"editor-toolbar"}>
                        <div style={{marginTop : "2px"}}>Color: </div>
                        <FormatSelect command={new TextColorCommand()} callback={node => node.color}>
                            {
                                colors.map(color => (
                                    <option key={color} value={`var(${color})`} style={{color: `var(${color})`}}>{color.substring(14)}</option>
                                ))
                            }
                        </FormatSelect>
                        <div style={{marginTop : "2px"}}>Background: </div>
                        <FormatSelect command={new BackgroundColorCommand()} callback={node => node.backgroundColor}>
                            {
                                colors.map(color => (
                                    <option key={color} value={`var(${color})`} style={{color: `var(${color})`}}>{color.substring(14)}</option>
                                ))
                            }
                        </FormatSelect>
                    </div>
                </Page>
                <Page>
                    <div className={"editor-toolbar"}>Tools</div>
                </Page>
                <Page>
                    <div className={"editor-toolbar"}>
                        {
                            providers.map((provider: AbstractProvider<any, any, any, any>) => (
                                <ActionButton key={provider.type} command={new provider.command()}>{provider.icon}</ActionButton>
                            ))
                        }
                    </div>
                </Page>
            </Pages>
            <button className={"material-icons"} onClick={() => onPage(page + 1 === 5 ? 0 : page + 1)}>arrow_right</button>
        </div>
    )
}

namespace Toolbar {
    export interface Attributes {
        page: number
        onPage: (value: number) => void
    }
}

export default Toolbar
