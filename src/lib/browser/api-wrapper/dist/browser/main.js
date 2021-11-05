var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { makeHttpRequestInstance } from '@bldr/http-request';
import { getConfig } from '@bldr/config-ng';
const config = getConfig();
const httpRequest = makeHttpRequestInstance(config, 'local', '/api/media');
export function updateMediaServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield httpRequest.request('mgmt/update');
        if (result.status !== 200) {
            throw new Error('Updating the media server failed.');
        }
        return result.data;
    });
}
