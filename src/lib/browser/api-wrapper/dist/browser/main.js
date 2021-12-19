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
const httpRequest = makeHttpRequestInstance(config, 'local', '/api/media');
function callWithErrorMessage(path, errorMessage) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield httpRequest.request(path);
        if (result.status !== 200) {
            throw new Error(errorMessage);
        }
        return result.data;
    });
}
export function updateMediaServer() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield callWithErrorMessage('mgmt/update', 'Updating the media server failed.');
    });
}
export function getStatsCount() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield callWithErrorMessage('stats/count', 'Fetching of statistical informations (stats/count) failed.');
    });
}
export function getStatsUpdates() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield callWithErrorMessage('stats/updates', 'Fetching of statistical informations (stats/updates) failed.');
    });
}
export function getAssetByUri(uri, throwException = true) {
    return __awaiter(this, void 0, void 0, function* () {
        const mediaUri = new MediaUri(uri);
        const field = mediaUri.scheme;
        const search = mediaUri.authority;
        const response = yield httpRequest.request({
            url: 'get/asset',
            method: 'get',
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
