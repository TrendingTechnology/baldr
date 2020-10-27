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
// Third party packages.
const chalk = require('chalk');
// Project packages.
const mediaServer = require('@bldr/media-server');
const { loadYaml, fetchFile } = require('@bldr/media-manager');
/**
 * @param {String} filePath - The media asset file path.
 */
function downloadCover(filePath, cmdObj) {
    return __awaiter(this, void 0, void 0, function* () {
        const yamlFile = `${filePath}.yml`;
        const metaData = loadYaml(yamlFile);
        console.log(metaData);
        if (metaData.cover_source) {
            const previewFile = `${filePath}_preview.jpg`;
            fetchFile(metaData.cover_source, previewFile);
        }
        else {
            console.log(chalk.red('No property “cover_source” found.'));
        }
    });
}
/**
 * @param {Array} files - An array of input files, comes from the commanders’
 *   variadic parameter `[files...]`.
 */
function action(files, cmdObj) {
    mediaServer.walk({
        asset(relPath) {
            return __awaiter(this, void 0, void 0, function* () {
                if (fs.existsSync(`${relPath}.yml`)) {
                    yield downloadCover(relPath, cmdObj);
                }
            });
        }
    }, {
        path: files
    });
}
module.exports = action;
