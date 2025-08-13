import "./Toolbar.css"
import React, {useContext} from "react"
import FormatButton from "./toolbar/FormatButton";
import FormatSelect from "./toolbar/FormatSelect";
import Pages from "../../../layout/pages/Pages";
import Page from "../../../layout/pages/Page";
import {BoldCommand, DeletedCommand, ItalicCommand} from "../commands/FormatCommand";
import ActionButton from "./toolbar/ActionButton";
import {BlockQuoteCommand, CodeCommand, HorizontalLineCommand, ListActionCommand, TableCommand} from "../commands/ActionCommand";
import {HeadingCommand} from "../commands/SelectCommand";
import ImageButton from "./toolbar/ImageButton";
import LinkButton from "./toolbar/LinkButton";
import {MarkDownContext} from "../MarkDownEditor";

function Toolbar(properties: Toolbar.Attributes) {

    const {page, onPage} = properties

    const {textAreaRef} = useContext(MarkDownContext)

    function onPageClick(value : number) {
        onPage(value)
        textAreaRef.current?.focus()
    }

    return (
        <div style={{display: "flex", justifyContent: "space-between"}}>
            <button type={"button"} className={"material-icons"} onClick={() => onPageClick(page - 1 === -1 ? 1 : page - 1)}>arrow_left</button>
            <Pages page={page}>
                <Page>
                    <div className={"editor-toolbar"}>
                        <FormatSelect command={new HeadingCommand()}>
                            <option value={"h1"}>H1</option>
                            <option value={"h2"}>H2</option>
                            <option value={"h3"}>H3</option>
                            <option value={"h4"}>H4</option>
                            <option value={"h5"}>H5</option>
                            <option value={"h6"}>H6</option>
                            <option value={"p"}>Paragraph</option>
                        </FormatSelect>
                        <FormatButton title={"Bold"} command={new BoldCommand()}>format_bold</FormatButton>
                        <FormatButton title={"Italic"} command={new ItalicCommand()}>format_italic</FormatButton>
                        <FormatButton title={"Deleted"} command={new DeletedCommand()}>strikethrough_s</FormatButton>
                    </div>
                </Page>
                <Page>
                    <div className={"editor-toolbar"}>
                        <ImageButton title={"Image"}>image</ImageButton>
                        <LinkButton title={"Link"}>link</LinkButton>
                        <ActionButton title={"List"} command={new ListActionCommand()}>list</ActionButton>
                        <ActionButton title={"Block Quote"} command={new BlockQuoteCommand()}>chevron_right</ActionButton>
                        <ActionButton title={"Horizontal Line"} command={new HorizontalLineCommand()}>horizontal_rule</ActionButton>
                        <ActionButton title={"Source Code"} command={new CodeCommand()}>code</ActionButton>
                        <ActionButton title={"Table"} command={new TableCommand()}>table</ActionButton>
                    </div>
                </Page>
            </Pages>
            <button type={"button"} className={"material-icons"} onClick={() => onPageClick(page + 1 === 2 ? 0 : page + 1)}>arrow_right</button>
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
