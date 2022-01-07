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
exports.openFileManager = exports.openEditor = exports.getTitleTree = exports.getAssetByUri = exports.readMediaAsString = exports.getDynamicSelectPresentations = exports.getPresentationByRef = exports.getPresentationByUri = exports.getPresentationByScheme = exports.getMediaStatistics = exports.updateMediaServer = void 0;
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
function getPresentationByScheme(scheme, authority) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield callWithErrorMessage(`media/presentations/by-${scheme}/${authority}`, `The presentation with the scheme “${scheme}” and the authority “${authority}” couldn’t be resolved.`);
    });
}
exports.getPresentationByScheme = getPresentationByScheme;
function getPresentationByUri(uri) {
    return __awaiter(this, void 0, void 0, function* () {
        const mediaUri = new client_media_models_1.MediaUri(uri);
        return yield getPresentationByScheme(mediaUri.scheme, mediaUri.authority);
    });
}
exports.getPresentationByUri = getPresentationByUri;
function getPresentationByRef(ref) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield getPresentationByScheme('ref', ref);
    });
}
exports.getPresentationByRef = getPresentationByRef;
function getDynamicSelectPresentations(substring) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield callWithErrorMessage({
            url: 'media/get/presentations/by-substring',
            method: 'GET',
            params: {
                search: substring
            }
        }, `Dynamic select results with the substring “${substring}” couldn’t be resolved.`);
    });
}
exports.getDynamicSelectPresentations = getDynamicSelectPresentations;
function readMediaAsString(relPath) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield callWithErrorMessage({
            url: `/media/${relPath}`,
            method: 'GET',
            headers: { 'Cache-Control': 'no-cache' }
        }, `The media file with the path “${relPath}” couldn’t be read from the file system over HTTP.`);
    });
}
exports.readMediaAsString = readMediaAsString;
function getAssetByUri(uri, throwException = true) {
    return __awaiter(this, void 0, void 0, function* () {
        const mediaUri = new client_media_models_1.MediaUri(uri);
        const response = yield httpRequest.request(`media/assets/by-${mediaUri.scheme}/${mediaUri.authority}`);
        if (response == null || response.status !== 200 || response.data == null) {
            if (throwException) {
                throw new Error(`The media with the ${mediaUri.scheme} ”${mediaUri.authority}” couldn’t be resolved.`);
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
        return yield callWithErrorMessage({ url: 'media/open/editor', params }, `Could not open the media file with the reference “${params.ref}” in the editor.`);
    });
}
exports.openEditor = openEditor;
function openFileManager(params) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield callWithErrorMessage({ url: 'media/open/file-manager', params }, `Could not open the media file with the reference “${params.ref}” in the file manager.`);
    });
}
exports.openFileManager = openFileManager;
