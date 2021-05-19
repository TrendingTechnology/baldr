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
// Project packages.
const file_reader_writer_1 = require("@bldr/file-reader-writer");
const media_categories_1 = require("@bldr/media-categories");
const config_1 = __importDefault(require("@bldr/config"));
const wikidata_1 = require("@bldr/wikidata");
/**
 * @param category - For example `group`, `instrument`, `person`,
 *   `song`
 * @param itemId - For example `Q123`
 */
function action(category, itemId, arg1, arg2, cmdObj) {
    return __awaiter(this, void 0, void 0, function* () {
        const rawData = yield wikidata_1.query(itemId, category, media_categories_1.categories);
        if (arg1 != null) {
            if (category === 'person') {
                rawData.firstname = arg1;
                rawData.lastname = arg2;
            }
        }
        rawData.categories = category;
        const data = media_categories_1.categoriesManagement.process(rawData);
        console.log(data);
        let downloadWikicommons = true;
        if ((rawData === null || rawData === void 0 ? void 0 : rawData.mainImage) == null) {
            data.mainImage = 'blank.jpg';
            downloadWikicommons = false;
        }
        const dest = media_categories_1.categoriesManagement.formatFilePath(data);
        if (dest == null)
            return;
        if (downloadWikicommons) {
            if (!cmdObj.dryRun && data.mainImage != null) {
                yield wikidata_1.fetchCommonsFile(data.mainImage, dest);
            }
            else {
                console.log(`Dry run! Destination: ${chalk_1.default.green(dest)}`);
            }
        }
        if (!cmdObj.dryRun && !fs_1.default.existsSync(dest)) {
            const src = path_1.default.join(config_1.default.localRepo, 'src', 'mgmt', 'cli', 'src', 'blank.jpg');
            console.log(src);
            fs_1.default.mkdirSync(path_1.default.dirname(dest), { recursive: true });
            fs_1.default.copyFileSync(src, dest);
            console.log('No Wikicommons file. Use temporary blank file instead.');
        }
        const yamlFile = `${dest}.yml`;
        if (!fs_1.default.existsSync(yamlFile)) {
            if (!cmdObj.dryRun) {
                console.log(`Write YAML file: ${chalk_1.default.green(yamlFile)}`);
                file_reader_writer_1.writeYamlFile(yamlFile, data);
            }
        }
        else {
            console.log(`The YAML file already exists: ${chalk_1.default.red(yamlFile)}`);
        }
    });
}
module.exports = action;
