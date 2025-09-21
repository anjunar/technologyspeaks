import 'source-map-support/register';
import { WebSocketServer } from 'ws';
import { renderApplication } from '@angular/platform-server';
import bootstrap from './main.server';
import detectPort from 'detect-port';
import {REQUEST, ServerRequest} from "shared";

let port = 4001;

detectPort(port).then(_port => {
  if (port === _port) {
    const wss = new WebSocketServer({ port: port, maxPayload: 10 * 1024 * 1024, perMessageDeflate: false  });

    wss.on('connection', ws => {
      ws.on('message', async (msg) => {
        const data : ServerRequest = JSON.parse(msg.toString());
        try {
          const html = await renderApplication(bootstrap, {
            document: data.document,
            url : data.path,
            platformProviders : [
                { provide : REQUEST, useValue : data }
            ]
          });
          ws.send(Buffer.from(JSON.stringify({ success: true, html })));
        } catch (err : any) {
          ws.send(Buffer.from(JSON.stringify({ success: false, error: err.message })));
        }
      });
    });

    console.log('SSR WebSocket Server running on ws://localhost:4001');
  } else {
    console.log(`Port ${port} not free. WS-Server not started.`);
  }
});
