import React, {useContext, useEffect, useState} from "react"
import {createPortal} from "react-dom";
import {Window} from "../../../../modal/window";
import Header = Window.Header;
import Content = Window.Content;
import {InputContainer} from "../../../container";
import Footer = Window.Footer;
import {MarkDownContext} from "../../MarkDownEditor";
import {Input} from "../../../input";

function LinkButton(properties: LinkButton.Attributes) {

    const {children, title} = properties

    const {model, textAreaRef, cursor} = useContext(MarkDownContext)

    const [open, setOpen] = useState(false)

    const [input, setInput] = useState("")

    const [name, setName] = useState("")

    const [disabled, setDisabled] = useState(false)

    function onSave() {
        let textArea = textAreaRef.current;

        let pre = textArea.value.substring(0, textArea.selectionStart);
        let post = textArea.value.substring(textArea.selectionStart);

        textArea.value = `${pre}[${name}](${input})${post}`

        const event = new Event('input', {bubbles: true, cancelable: true})
        textArea.dispatchEvent(event);

        textArea.focus()

        setOpen(false)
        setInput("")
        setName("")
    }

    return (
        <div>
            {
                open && createPortal(
                    <Window centered={true}>
                        <Header>
                            <div style={{display : "flex", justifyContent : "flex-end"}}>
                                <button className={"material-icons"} onClick={() => setOpen(false)}>close</button>
                            </div>
                        </Header>
                        <Content>
                            <InputContainer placeholder={"Name"}>
                                <Input type={"text"} value={name} onChange={(event : any) => setName(event)} standalone={true}/>
                            </InputContainer>
                            <InputContainer placeholder={"URL"}>
                                <Input type={"url"} value={input} onChange={(event : any) => setInput(event)} standalone={true}/>
                            </InputContainer>
                        </Content>
                        <Footer>
                            <button onClick={onSave}>Save</button>
                        </Footer>
                    </Window>,
                document.getElementById("viewport"))
            }
            <button disabled={disabled} title={title} className={"material-icons"} onClick={() => setOpen(true)}>{children}</button>
        </div>
    )
}

namespace LinkButton {
    export interface Attributes {
        children: React.ReactNode
        title : string
    }
}

export default LinkButton