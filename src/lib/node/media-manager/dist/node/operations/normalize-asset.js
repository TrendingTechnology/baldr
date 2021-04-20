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
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeMediaAsset = void 0;
const assert_1 = __importDefault(require("assert"));
const core_browser_1 = require("@bldr/core-browser");
const wikidata_1 = __importDefault(require("@bldr/wikidata"));
const media_categories_management_1 = __importDefault(require("../media-categories-management"));
const main_1 = require("../main");
function queryWikidata(metaData, categoryNames, typeSpecs) {
    return __awaiter(this, void 0, void 0, function* () {
        const dataWiki = yield wikidata_1.default.query(metaData.wikidata, categoryNames, typeSpecs);
        console.log(dataWiki);
        metaData = wikidata_1.default.mergeData(metaData, dataWiki, typeSpecs);
        // To avoid blocking
        // url: 'https://www.wikidata.org/w/api.php?action=wbgetentities&ids=Q16276296&format=json&languages=en%7Cde&props=labels',
        // status: 429,
        // statusText: 'Scripted requests from your IP have been blocked, please
        // contact noc@wikimedia.org, and see also https://meta.wikimedia.org/wiki/User-Agent_policy',
        core_browser_1.msleep(3000);
        return metaData;
    });
}
/**
 * @param filePath - The media asset file path.
 */
function normalizeMediaAsset(filePath, options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const yamlFile = `${filePath}.yml`;
            let metaData = main_1.readAssetYaml(filePath);
            if (!metaData) {
                return;
            }
            metaData.filePath = filePath;
            const origData = core_browser_1.deepCopy(metaData);
            // Always: general
            const categoryNames = media_categories_management_1.default.detectCategoryByPath(filePath);
            if (categoryNames) {
                metaData.categories = media_categories_management_1.default.mergeNames(metaData.categories, categoryNames);
            }
            if (options && options.wikidata) {
                if (metaData.wikidata && metaData.categories) {
                    metaData = yield queryWikidata(metaData, metaData.categories, media_categories_management_1.default.categories);
                }
            }
            metaData = media_categories_management_1.default.process(metaData);
            try {
                delete origData.filePath;
                assert_1.default.deepStrictEqual(origData, metaData);
            }
            catch (error) {
                main_1.writeYamlFile(yamlFile, metaData);
            }
        }
        catch (error) {
            console.log(filePath);
            console.log(error);
            process.exit();
        }
    });
}
exports.normalizeMediaAsset = normalizeMediaAsset;
