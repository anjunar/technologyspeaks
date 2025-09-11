import { WebSocketServer } from 'ws';
import { renderApplication } from '@angular/platform-server';
import bootstrap from './main.server';
import detectPort from 'detect-port';

let port = 4001;

detectPort(port).then(_port => {
  if (port === _port) {
    const wss = new WebSocketServer({ port: port });

    wss.on('connection', ws => {
      ws.on('message', async (msg) => {
        const data = JSON.parse(msg.toString());
        try {
          const html = await renderApplication(bootstrap, {
            document: data.document,
            url : data.url,
          });
          ws.send(JSON.stringify({ success: true, html }));
        } catch (err : any) {
          ws.send(JSON.stringify({ success: false, error: err.message }));
        }
      });
    });

    console.log('SSR WebSocket Server running on ws://localhost:4001');
  } else {
    console.log(`Port ${port} schon belegt. WS-Server nicht gestartet.`);
  }
});
