import './ChatPage.css'
import React, {useContext, useLayoutEffect, useRef, useState} from 'react';
import { remark } from 'remark'
import rehypePrism from "rehype-prism-plus";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import {v4} from "uuid";
import {SystemContext} from "react-ui-simplicity/src/System";

export function ChatPage(properties: ChatPage.Attributes) {

    const {} = properties

    const [buffer, setBuffer] = useState("")

    const [htmlBuffer, setHtmlBuffer] = useState("")

    const [open, setOpen] = useState(true)

    const {info} = useContext(SystemContext)

    const scrollRef = useRef<HTMLDivElement>(null);

    const eventSourceRef = useRef<WebSocket>(null);

    async function markdownToHtml(markdownText) {
        const file = await remark()
            .use(remarkRehype)
            .use(rehypePrism)
            .use(remarkGfm)
            .use(rehypeStringify)
            .process(markdownText)

        setHtmlBuffer(file.toString())
    }

    function onKeyUp(event : React.KeyboardEvent<HTMLTextAreaElement>) {
        let value = event.currentTarget.value;

        function startChatStream() : WebSocket {
            const ws = new WebSocket(`wss://${info.host}/ws/chat`);

            ws.onopen = () => {
                ws.send(value);
                setOpen(false)
            }

            ws.onmessage = event => {
                let data = event.data as string;

                if (data === "!Done!") {
                    ws.close()
                    setOpen(true)
                } else {
                    setBuffer((prev) => {
                        const next = prev + data

                        requestAnimationFrame(() => {
                            if (scrollRef.current) {
                                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                            }
                        });

                        return next;
                    });
                }
            }

            ws.onclose = () => {
                setOpen(true)
                console.log("Disconnected");
            }

            return ws
        }

        if (event.key === "Enter") {
            event.preventDefault()

            let eventSource = startChatStream();
            eventSourceRef.current = eventSource;

            eventSource.onerror = (e) => {
                console.error(e)
                eventSource.close()

                setTimeout(() => {
                    eventSource = startChatStream()
                    eventSourceRef.current = eventSource;
                }, 3000);
            }
        }
    }

    useLayoutEffect(() => {
        markdownToHtml(buffer)
    }, [buffer]);

    return (
        <div className={"chat-page"}>
            <div className={"center-horizontal"}>
                <div ref={scrollRef} style={{minWidth : "360px", maxWidth: "800px", width : "100%", height : "100%", overflowY : "auto", padding : "20px"}}>
                    <div>
                        <h1>Chat</h1>
                    </div>
                    <div dangerouslySetInnerHTML={{__html : htmlBuffer}} style={{whiteSpace : "pre-wrap"}}></div>
                    <div style={{backgroundColor : "var(--color-background-tertiary)"}}>
                        {
                            open ? (<textarea placeholder={"Message"} onKeyUp={onKeyUp} style={{width : "100%", height : "100px"}}/>) : (<button onClick={() => {eventSourceRef.current.close(); setOpen(true)}}>Close</button>)
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

namespace ChatPage {
    export interface Attributes {
    }
}

export default ChatPage;