var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getConfig } from '@bldr/config';
import { makeHttpRequestInstance } from '@bldr/http-request';
import { MediaUri } from '@bldr/client-media-models';
const config = getConfig();
const httpRequest = makeHttpRequestInstance(config, 'local', '/api');
function callWithErrorMessage(requestConfig, errorMessage) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield httpRequest.request(requestConfig);
        if (result.status !== 200) {
            throw new Error(errorMessage);
        }
        return result.data;
    });
}
export function updateMediaServer() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield callWithErrorMessage({ url: 'media', method: 'PUT' }, 'Updating the media server failed.');
    });
}
export function getMediaStatistics() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield callWithErrorMessage({ url: 'media', method: 'GET' }, 'Fetching of statistical informations (stats/count) failed.');
    });
}
export function getPresentationByRef(ref) {
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
export function getDynamicSelectPresentations(substring) {
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
export function readMediaAsString(relPath) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield callWithErrorMessage({
            url: `/media/${relPath}`,
            method: 'GET',
            headers: { 'Cache-Control': 'no-cache' }
        }, `The media file with the path “${relPath}” couldn’t be read from the file system over HTTP.`);
    });
}
export function getAssetByUri(uri, throwException = true) {
    return __awaiter(this, void 0, void 0, function* () {
        const mediaUri = new MediaUri(uri);
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
export function getTitleTree() {
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
export function openEditor(params) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield callWithErrorMessage({ url: 'media/open/editor', params }, `Could not open the media file with the reference “${params.ref}” in the editor.`);
    });
}
export function openFileManager(params) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield callWithErrorMessage({ url: 'media/open/file-manager', params }, `Could not open the media file with the reference “${params.ref}” in the file manager.`);
    });
}
