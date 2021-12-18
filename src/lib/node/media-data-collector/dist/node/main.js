"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPresentationData = exports.buildMinimalAssetData = exports.buildDbAssetData = void 0;
const asset_builder_1 = require("./asset-builder");
const presentation_builder_1 = require("./presentation-builder");
function buildDbAssetData(filePath) {
    const builder = new asset_builder_1.AssetBuilder(filePath);
    return builder.buildForDb();
}
exports.buildDbAssetData = buildDbAssetData;
function buildMinimalAssetData(filePath) {
    const builder = new asset_builder_1.AssetBuilder(filePath);
    return builder.buildMinimal();
}
exports.buildMinimalAssetData = buildMinimalAssetData;
function buildPresentationData(filePath) {
    const builder = new presentation_builder_1.PresentationBuilder(filePath);
    return builder.build();
}
exports.buildPresentationData = buildPresentationData;
