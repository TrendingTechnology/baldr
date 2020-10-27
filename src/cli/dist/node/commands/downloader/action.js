var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { operations } = require('@bldr/media-manager');
const { fetchFile } = require('@bldr/core-node');
/**
 * Download a media asset.
 *
 * @param {String} url The source URL.
 * @param {String} id The ID of the destination file.
 * @param {String} extension The extension of the destination file.
 */
function action(url, id = null, extension = null) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!extension) {
            extension = url.substring(url.lastIndexOf('.') + 1);
        }
        if (!id) {
            id = url.substring(url.lastIndexOf('/') + 1);
            id = id.replace(/\.\w+$/, '');
        }
        let destFile = `${id}.${extension}`;
        yield fetchFile(url, destFile);
        // Make images smaller.
        destFile = yield operations.convertAsset(destFile);
        yield operations.initializeMetaYaml(destFile, { source: url });
    });
}
module.exports = action;
