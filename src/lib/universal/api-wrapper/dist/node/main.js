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
exports.openFileManager = exports.openEditor = exports.getTitleTree = exports.getAssetByUri = exports.getPresentationAsStringByPath = exports.getPresentationByRef = exports.getMediaStatistics = exports.updateMediaServer = void 0;
const config_1 = require("@bldr/config");
const http_request_1 = require("@bldr/http-request");
const client_media_models_1 = require("@bldr/client-media-models");
const config = (0, config_1.getConfig)();
const httpRequest = (0, http_request_1.makeHttpRequestInstance)(config, 'local', '/api');
function callWithErrorMessage(requestConfig, errorMessage) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield httpRequest.request(requestConfig);
        if (result.status !== 200) {
            throw new Error(errorMessage);
        }
        return result.data;
    });
}
function updateMediaServer() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield callWithErrorMessage({ url: 'media', method: 'PUT' }, 'Updating the media server failed.');
    });
}
exports.updateMediaServer = updateMediaServer;
function getMediaStatistics() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield callWithErrorMessage({ url: 'media', method: 'GET' }, 'Fetching of statistical informations (stats/count) failed.');
    });
}
exports.getMediaStatistics = getMediaStatistics;
function getPresentationByRef(ref) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield callWithErrorMessage({
            url: 'media/get/presentation/by-ref',
            method: 'GET',
            params: {
                ref
            }
        }, `The presentation with the reference “${ref}” couldn’t be resolved.`);
    });
}
exports.getPresentationByRef = getPresentationByRef;
function getPresentationAsStringByPath(relPath) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield callWithErrorMessage({
            url: `/media/${relPath}`,
            method: 'GET',
            headers: { 'Cache-Control': 'no-cache' }
        }, `The presentation with the path “${relPath}” couldn’t be read from the file system over HTTP.`);
    });
}
exports.getPresentationAsStringByPath = getPresentationAsStringByPath;
function getAssetByUri(uri, throwException = true) {
    return __awaiter(this, void 0, void 0, function* () {
        const mediaUri = new client_media_models_1.MediaUri(uri);
        const field = mediaUri.scheme;
        const search = mediaUri.authority;
        const response = yield httpRequest.request({
            url: 'media/get/asset',
            method: 'GET',
            params: {
                [mediaUri.scheme]: mediaUri.authority
            }
        });
        if (response == null || response.status !== 200 || response.data == null) {
            if (throwException) {
                throw new Error(`The media with the ${field} ”${search}” couldn’t be resolved.`);
            }
        }
        else {
            return response.data;
        }
    });
}
exports.getAssetByUri = getAssetByUri;
function getTitleTree() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield callWithErrorMessage({
            url: 'media/titles',
            method: 'GET',
            headers: { 'Cache-Control': 'no-cache' },
            params: {
                timestamp: new Date().getTime()
            }
        }, 'The title tree couldn’t be resolved.');
    });
}
exports.getTitleTree = getTitleTree;
function openEditor(params) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield callWithErrorMessage({ url: 'media/open/editor', params }, 'Open Editor.');
    });
}
exports.openEditor = openEditor;
function openFileManager(params) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield callWithErrorMessage({ url: 'media/open/file-manager', params }, 'Open Editor.');
    });
}
exports.openFileManager = openFileManager;
