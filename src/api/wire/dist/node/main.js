#! /usr/bin/env node
"use strict";
/**
 * A websocket server to connect multiple baldr lamp sessions.
 *
 * @see {@link module:@bldr/lamp/remote-control}
 * @see {@link https://www.npmjs.com/package/ws Package “ws” on npm}
 * @see {@link https://github.com/websockets/ws/blob/master/doc/ws.md API documentation of the package “ws”}
 *
 * @module @bldr/wire
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Third party packages.
var ws_1 = __importDefault(require("ws"));
// Globals.
var config_1 = __importDefault(require("@bldr/config-ng"));
/**
 * Launch the web socket server.
 */
function main() {
    var webSocketServer = new ws_1.default.Server({ port: config_1.default.wire.port });
    webSocketServer.on('connection', function connection(webSocket) {
        webSocket.on('message', function incoming(message) {
            console.log('received: %s', message);
            // https://github.com/websockets/ws#server-broadcast
            webSocketServer.clients.forEach(function each(client) {
                if (client !== webSocket && client.readyState === ws_1.default.OPEN) {
                    client.send(message);
                }
            });
        });
    });
}
if (require.main === module) {
    main();
}
