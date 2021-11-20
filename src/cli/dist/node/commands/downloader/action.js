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
const media_manager_1 = require("@bldr/media-manager");
const core_node_1 = require("@bldr/core-node");
/**
 * Download a media asset.
 *
 * @param url - The source URL.
 * @param id - The ID of the destination file.
 * @param extension - The extension of the destination file.
 */
function action(url, id, extension) {
    return __awaiter(this, void 0, void 0, function* () {
        if (extension == null) {
            extension = url.substring(url.lastIndexOf('.') + 1);
        }
        if (id == null) {
            id = url.substring(url.lastIndexOf('/') + 1);
            id = id.replace(/\.\w+$/, '');
        }
        const destFile = `${id}.${extension}`;
        yield (0, core_node_1.fetchFile)(url, destFile);
        // Make images smaller.
        const convertedDestFile = yield media_manager_1.operations.convertAsset(destFile);
        if (convertedDestFile != null) {
            const metaData = { source: url };
            const meta = metaData;
            yield media_manager_1.operations.initializeMetaYaml(destFile, meta);
        }
    });
}
module.exports = action;
