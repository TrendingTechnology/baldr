#! /usr/bin/env node
/**
 * A websocket server to connect multiple baldr presentation sessions.
 *
 * @see {@link module:@bldr/presentation/remote-control}
 * @see {@link https://www.npmjs.com/package/ws Package “ws” on npm}
 * @see {@link https://github.com/websockets/ws/blob/master/doc/ws.md API documentation of the package “ws”}
 *
 * @module @bldr/websocket
 */
import WebSocket from 'ws';
// Globals.
import { getConfig } from '@bldr/config';
import { isModuleMain } from '@bldr/node-utils';
const config = getConfig();
/**
 * Launch the web socket server.
 */
function main() {
    const webSocketServer = new WebSocket.Server({ port: config.websocket.port });
    webSocketServer.on('connection', function (webSocket) {
        webSocket.on('message', function (message) {
            console.log('received: %s', message);
            // https://github.com/websockets/ws#server-broadcast
            webSocketServer.clients.forEach(function (client) {
                if (client !== webSocket && client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
        });
    });
}
if (isModuleMain(import.meta)) {
    main();
}
