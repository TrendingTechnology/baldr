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
Object.defineProperty(exports, "__esModule", { value: true });
const media_categories_1 = require("@bldr/media-categories");
const file_reader_writer_1 = require("@bldr/file-reader-writer");
const log = __importStar(require("@bldr/log"));
const config_1 = require("@bldr/config");
const config = config_1.getConfig();
function action() {
    media_categories_1.stripCategories();
    const configJson = file_reader_writer_1.readJsonFile(config.configurationFileLocations[1]);
    configJson.mediaCategories = media_categories_1.stripCategories();
    configJson.twoLetterAbbreviations = media_categories_1.twoLetterAbbreviations;
    for (const filePath of config.configurationFileLocations) {
        log.info('Patch configuration file %s\n', [filePath]);
        log.info(file_reader_writer_1.writeJsonFile(filePath, configJson));
    }
}
module.exports = action;
