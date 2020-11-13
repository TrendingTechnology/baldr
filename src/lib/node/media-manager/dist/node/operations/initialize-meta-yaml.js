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
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeMetaYaml = void 0;
const rename_asset_1 = require("./rename-asset");
const normalize_asset_1 = require("./normalize-asset");
const yaml_1 = require("../yaml");
/**
 * Rename, create metadata yaml and normalize the metadata file.
 *
 * @param filePath
 * @param metaData
 */
function initializeMetaYaml(filePath, metaData) {
    return __awaiter(this, void 0, void 0, function* () {
        const newPath = rename_asset_1.renameMediaAsset(filePath);
        yaml_1.writeMetaDataYaml(newPath, metaData);
        yield normalize_asset_1.normalizeMediaAsset(newPath, { wikidata: false });
    });
}
exports.initializeMetaYaml = initializeMetaYaml;
