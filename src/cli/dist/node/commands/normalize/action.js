var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Node packages.
const fs = require('fs');
// Project packages.
const mediaServer = require('@bldr/media-server');
const { operations } = require('@bldr/media-manager');
/**
 * @param {Array} files - An array of input files, comes from the commanders’
 *   variadic parameter `[files...]`.
 */
function action(files, cmdObj) {
    mediaServer.walk({
        asset(relPath) {
            return __awaiter(this, void 0, void 0, function* () {
                if (fs.existsSync(`${relPath}.yml`)) {
                    yield operations.normalizeMediaAsset(relPath, cmdObj);
                }
            });
        }
    }, {
        path: files
    });
}
module.exports = action;
