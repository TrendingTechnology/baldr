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
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeMediaAsset = void 0;
const assert_1 = __importDefault(require("assert"));
const core_browser_1 = require("@bldr/core-browser");
const wikidata_1 = __importDefault(require("@bldr/wikidata"));
const media_categories_1 = require("@bldr/media-categories");
const file_reader_writer_1 = require("@bldr/file-reader-writer");
const log = __importStar(require("@bldr/log"));
const yaml_1 = require("@bldr/yaml");
const main_1 = require("../main");
function queryWikidata(metaData, categoryNames, categoryCollection) {
    return __awaiter(this, void 0, void 0, function* () {
        const dataWiki = yield wikidata_1.default.query(metaData.wikidata, categoryNames, categoryCollection);
        console.log(dataWiki);
        metaData = wikidata_1.default.mergeData(metaData, dataWiki, categoryCollection);
        // To avoid blocking
        // url: 'https://www.wikidata.org/w/api.php?action=wbgetentities&ids=Q16276296&format=json&languages=en%7Cde&props=labels',
        // status: 429,
        // statusText: 'Scripted requests from your IP have been blocked, please
        // contact noc@wikimedia.org, and see also https://meta.wikimedia.org/wiki/User-Agent_policy',
        (0, core_browser_1.msleep)(3000);
        return metaData;
    });
}
function logDiff(oldMetaData, newMetaData) {
    log.verbose(log.colorizeDiff((0, yaml_1.convertToYaml)(oldMetaData), (0, yaml_1.convertToYaml)(newMetaData)));
}
/**
 * @param filePath - The media asset file path.
 */
function normalizeMediaAsset(filePath, options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const yamlFile = `${filePath}.yml`;
            const raw = (0, main_1.readAssetYaml)(filePath);
            if (raw != null) {
                raw.filePath = filePath;
            }
            let metaData = raw;
            if (metaData == null) {
                return;
            }
            const origData = (0, core_browser_1.deepCopy)(metaData);
            // Always: general
            const categoryNames = media_categories_1.categoriesManagement.detectCategoryByPath(filePath);
            if (categoryNames != null) {
                const categories = metaData.categories != null ? metaData.categories : '';
                metaData.categories = media_categories_1.categoriesManagement.mergeNames(categories, categoryNames);
            }
            if ((options === null || options === void 0 ? void 0 : options.wikidata) != null) {
                if (metaData.wikidata != null && metaData.categories != null) {
                    metaData = yield queryWikidata(metaData, metaData.categories, media_categories_1.categories);
                }
            }
            const newMetaData = media_categories_1.categoriesManagement.process(metaData, filePath);
            const oldMetaData = origData;
            delete oldMetaData.filePath;
            try {
                assert_1.default.deepStrictEqual(oldMetaData, newMetaData);
            }
            catch (error) {
                logDiff(oldMetaData, newMetaData);
                (0, file_reader_writer_1.writeYamlFile)(yamlFile, newMetaData);
            }
        }
        catch (error) {
            log.error(filePath);
            log.error(error);
            process.exit();
        }
    });
}
exports.normalizeMediaAsset = normalizeMediaAsset;
