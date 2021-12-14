"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readPresentationFile = exports.readAssetFile = void 0;
const asset_builder_1 = require("./asset-builder");
const presentation_builder_1 = require("./presentation-builder");
function readAssetFile(filePath) {
    const builder = new asset_builder_1.AssetBuilder(filePath);
    builder.buildAll();
    return builder.export();
}
exports.readAssetFile = readAssetFile;
function readPresentationFile(filePath) {
    const builder = new presentation_builder_1.PresentationBuilder(filePath);
    builder.buildAll();
    return builder.export();
}
exports.readPresentationFile = readPresentationFile;
