(require as any).extensions[".css"] = () => {};
import WebSocket, { WebSocketServer } from 'ws';
import { renderToString } from "react-dom/server";
import { resolveComponentList, resolveRoute } from "react-ui-simplicity";
import { routes } from "./routes";
import React from "react";
import { App } from "./App";
import * as cheerio from "cheerio";
import { RequestInformation } from "./request";

const wss = new WebSocketServer({ port: 8081 });
Error.stackTraceLimit = 20

wss.on('connection', (ws: WebSocket) => {

    ws.send(JSON.stringify({ type: "ready" }));

    ws.on('message', async (data) => {
        try {
            const { request, html }: { request: RequestInformation, html: string } = JSON.parse(data.toString());

            const resolved = resolveRoute(request, routes);
            const components = await resolveComponentList(resolved, request);

            if (components) {
                const appHtml = renderToString(<App data={components} info={request} />);
                const $ = cheerio.load(html);
                $('#root').html(appHtml);
                $('html').attr("data-theme", request.cookie["theme"] || "light");

                ws.send(JSON.stringify({
                    type: "html",
                    html: $.html()
                }));

            } else {
                ws.send(JSON.stringify({
                    type: "status",
                    code: 404
                }));
            }

        } catch (error: any) {
            if (error.url) {
                ws.send(JSON.stringify({
                    type: "redirect",
                    url: error.url,
                    code: 302
                }))
            } else {
                ws.send(JSON.stringify({
                    type: "error",
                    message: error.message,
                    stack : error.stack,
                    code: error.code || 500
                }));
            }
        }
    });
});

console.log('WebSocket server listening on ws://localhost:8080');
