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
const operations_1 = require("../operations");
const yaml_1 = require("../yaml");
/**
 * Rename, create metadata yaml and normalize the metadata file.
 */
function initializeMetaYaml(filePath, metaData) {
    return __awaiter(this, void 0, void 0, function* () {
        const newPath = operations_1.operations.renameMediaAsset(filePath);
        yield (0, yaml_1.writeYamlMetaData)(newPath, metaData);
        yield operations_1.operations.normalizeMediaAsset(newPath, { wikidata: false });
    });
}
exports.initializeMetaYaml = initializeMetaYaml;
