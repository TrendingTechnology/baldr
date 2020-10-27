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
const path = require('path');
// Third party packages.
const chalk = require('chalk');
const wikidata = require('@bldr/wikidata').default;
// Project packages.
const metaTypes = require('@bldr/media-server').metaTypes;
const { writeYamlFile } = require('@bldr/media-manager');
/**
 * @param {String} metaType - For example `group`, `instrument`, `person`,
 *   `song`
 * @param {String} itemId - For example `Q123`
 * @param {String} arg1
 * @param {String} arg2
 */
function action(metaType, itemId, arg1, arg2, cmdObj) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = yield wikidata.query(itemId, metaType, metaTypes.typeSpecs);
        if (arg1) {
            if (metaType === 'person') {
                data.firstname = arg1;
                data.lastname = arg2;
            }
        }
        data.metaTypes = metaType;
        data = metaTypes.process(data);
        console.log(data);
        let downloadWikicommons = true;
        if (!data.mainImage) {
            data.mainImage = 'blank.jpg';
            downloadWikicommons = false;
        }
        const dest = metaTypes.formatFilePath(data);
        if (downloadWikicommons) {
            if (!cmdObj.dryRun) {
                yield wikidata.fetchCommonsFile(data.mainImage, dest);
            }
            else {
                console.log(`Dry run! Destination: ${chalk.green(dest)}`);
            }
        }
        if (!cmdObj.dryRun && !fs.existsSync(dest)) {
            const src = path.join(__dirname, '..', '..', 'blank.jpg');
            console.log(src);
            fs.mkdirSync(path.dirname(dest), { recursive: true });
            fs.copyFileSync(src, dest);
            console.log(`No Wikicommons file. Use temporary blank file instead.`);
        }
        const yamlFile = `${dest}.yml`;
        if (!fs.existsSync(yamlFile)) {
            if (!cmdObj.dryRun) {
                console.log(`Write YAML file: ${chalk.green(yamlFile)}`);
                writeYamlFile(yamlFile, data);
            }
        }
        else {
            console.log(`The YAML file already exists: ${chalk.red(yamlFile)}`);
        }
    });
}
module.exports = action;
