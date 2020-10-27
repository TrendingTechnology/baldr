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
const glob = require('glob');
// Project packages.
const coreBrowser = require('@bldr/core-browser');
const { writeMetaDataYaml, operations } = require('@bldr/media-manager');
function action(globPattern, prefix, cmdObj) {
    return __awaiter(this, void 0, void 0, function* () {
        const files = glob.sync(globPattern);
        if (files.length < 1) {
            console.log('Glob matches no files.');
            return;
        }
        files.sort();
        let no = 1;
        const extension = files[0].split('.').pop();
        const firstNewFileName = `${prefix}.${extension}`;
        for (const oldFileName of files) {
            // Omit already existent info file by the renaming.
            if (!oldFileName.match(/yml$/i)) {
                const newFileName = coreBrowser.formatMultiPartAssetFileName(`${prefix}.${extension}`, no);
                console.log(`${chalk.yellow(oldFileName)} -> ${chalk.green(newFileName)}`);
                if (!cmdObj.dryRun)
                    fs.renameSync(oldFileName, newFileName);
                no += 1;
            }
        }
        if (fs.existsSync(firstNewFileName) && !cmdObj.dryRun) {
            writeMetaDataYaml(firstNewFileName);
            yield operations.normalizeMediaAsset(firstNewFileName, { wikidata: false });
        }
    });
}
module.exports = action;
