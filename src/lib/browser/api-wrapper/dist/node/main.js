"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMediaServer = void 0;
const http_request_1 = require("@bldr/http-request");
const config_ng_1 = require("@bldr/config-ng");
const config = config_ng_1.getConfig();
const httpRequest = http_request_1.makeHttpRequestInstance(config, 'local', '/api/media');
function updateMediaServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield httpRequest.request('mgmt/update');
        if (result.status !== 200) {
            throw new Error('Updating the media server failed.');
        }
        return result.data;
    });
}
exports.updateMediaServer = updateMediaServer;
