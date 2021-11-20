"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
// Project packages.
const media_categories_1 = require("@bldr/media-categories");
const wikidata_1 = require("@bldr/wikidata");
const file_reader_writer_1 = require("@bldr/file-reader-writer");
const log = __importStar(require("@bldr/log"));
const config_1 = require("@bldr/config");
const config = (0, config_1.getConfig)();
/**
 * @param category - For example `group`, `instrument`, `person`,
 *   `song`
 * @param itemId - For example `Q123`
 */
function action(category, itemId, arg1, arg2, cmdObj) {
    return __awaiter(this, void 0, void 0, function* () {
        const rawData = yield (0, wikidata_1.query)(itemId, category, media_categories_1.categories);
        if (arg1 != null) {
            if (category === 'person') {
                rawData.firstname = arg1;
                rawData.lastname = arg2;
            }
        }
        rawData.categories = category;
        const data = yield media_categories_1.categoriesManagement.process(rawData);
        log.infoAny(data);
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
                yield (0, wikidata_1.fetchCommonsFile)(data.mainImage, dest);
            }
            else {
                log.info('Dry run! Destination: %s', [dest]);
            }
        }
        if (!cmdObj.dryRun && !fs_1.default.existsSync(dest)) {
            const src = path_1.default.join(config.localRepo, 'src', 'cli', 'src', 'blank.jpg');
            log.info(src);
            fs_1.default.mkdirSync(path_1.default.dirname(dest), { recursive: true });
            fs_1.default.copyFileSync(src, dest);
            log.info('No Wikicommons file. Use temporary blank file instead.');
        }
        const yamlFile = `${dest}.yml`;
        if (!fs_1.default.existsSync(yamlFile)) {
            if (!cmdObj.dryRun) {
                log.info('Write YAML file: %s', [yamlFile]);
                (0, file_reader_writer_1.writeYamlFile)(yamlFile, data);
            }
        }
        else {
            log.info('The YAML file already exists: %s', [yamlFile]);
        }
    });
}
module.exports = action;
