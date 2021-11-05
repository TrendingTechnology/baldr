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
exports.getStatsUpdates = exports.getStatsCount = exports.updateMediaServer = void 0;
const config_ng_1 = require("@bldr/config-ng");
const http_request_1 = require("@bldr/http-request");
const config = config_ng_1.getConfig();
const httpRequest = http_request_1.makeHttpRequestInstance(config, 'local', '/api/media');
function callWithErrorMessage(path, errorMessage) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield httpRequest.request(path);
        if (result.status !== 200) {
            throw new Error(errorMessage);
        }
        return result.data;
    });
}
function updateMediaServer() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield callWithErrorMessage('mgmt/update', 'Updating the media server failed.');
    });
}
exports.updateMediaServer = updateMediaServer;
function getStatsCount() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield callWithErrorMessage('stats/count', 'Fetching of statistical informations (stats/count) failed.');
    });
}
exports.getStatsCount = getStatsCount;
function getStatsUpdates() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield callWithErrorMessage('stats/updates', 'Fetching of statistical informations (stats/updates) failed.');
    });
}
exports.getStatsUpdates = getStatsUpdates;
