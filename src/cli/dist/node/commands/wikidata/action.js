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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// Node packages.
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Third party packages.
const chalk_1 = __importDefault(require("chalk"));
const wikidata_1 = __importDefault(require("@bldr/wikidata"));
// Project packages.
const media_manager_1 = require("@bldr/media-manager");
/**
 * @param {String} metaType - For example `group`, `instrument`, `person`,
 *   `song`
 * @param {String} itemId - For example `Q123`
 * @param {String} arg1
 * @param {String} arg2
 */
function action(metaType, itemId, arg1, arg2, cmdObj) {
    return __awaiter(this, void 0, void 0, function* () {
        let rawData = yield wikidata_1.default.query(itemId, metaType, media_manager_1.metaTypes.typeSpecs);
        if (arg1) {
            if (metaType === 'person') {
                rawData.firstname = arg1;
                rawData.lastname = arg2;
            }
        }
        rawData.metaTypes = metaType;
        const data = media_manager_1.metaTypes.process(rawData);
        console.log(data);
        let downloadWikicommons = true;
        if (!rawData.mainImage) {
            data.mainImage = 'blank.jpg';
            downloadWikicommons = false;
        }
        const dest = media_manager_1.metaTypes.formatFilePath(data);
        if (downloadWikicommons) {
            if (!cmdObj.dryRun) {
                yield wikidata_1.default.fetchCommonsFile(data.mainImage, dest);
            }
            else {
                console.log(`Dry run! Destination: ${chalk_1.default.green(dest)}`);
            }
        }
        if (!cmdObj.dryRun && !fs_1.default.existsSync(dest)) {
            const src = path_1.default.join(__dirname, '..', '..', 'blank.jpg');
            console.log(src);
            fs_1.default.mkdirSync(path_1.default.dirname(dest), { recursive: true });
            fs_1.default.copyFileSync(src, dest);
            console.log(`No Wikicommons file. Use temporary blank file instead.`);
        }
        const yamlFile = `${dest}.yml`;
        if (!fs_1.default.existsSync(yamlFile)) {
            if (!cmdObj.dryRun) {
                console.log(`Write YAML file: ${chalk_1.default.green(yamlFile)}`);
                media_manager_1.writeYamlFile(yamlFile, data);
            }
        }
        else {
            console.log(`The YAML file already exists: ${chalk_1.default.red(yamlFile)}`);
        }
    });
}
module.exports = action;
