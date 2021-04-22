"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateIdPrefix = exports.validateYoutubeId = exports.validateUuid = exports.validateMediaId = exports.validateDate = exports.categories = exports.categoriesManagement = void 0;
const management_1 = __importDefault(require("./management"));
const path_1 = __importDefault(require("path"));
const core_browser_1 = require("@bldr/core-browser");
exports.categoriesManagement = management_1.default;
exports.categories = exports.categoriesManagement.categories;
/**
 * Validate a date string in the format `yyyy-mm-dd`.
 */
function validateDate(value) {
    return (value.match(/\d{4,}-\d{2,}-\d{2,}/) != null);
}
exports.validateDate = validateDate;
/**
 * Validate a ID string of the Baldr media server.
 */
function validateMediaId(value) {
    return (value.match(core_browser_1.MediaUri.regExp) != null);
}
exports.validateMediaId = validateMediaId;
/**
 * Validate UUID string (for the Musicbrainz references).
 */
function validateUuid(value) {
    return (value.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89AB][0-9a-f]{3}-[0-9a-f]{12}$/i) != null);
}
exports.validateUuid = validateUuid;
/**
 * Validate a YouTube ID.
 */
function validateYoutubeId(value) {
    // https://webapps.stackexchange.com/a/101153
    return (value.match(/^[0-9A-Za-z_-]{10}[048AEIMQUYcgkosw]$/) != null);
}
exports.validateYoutubeId = validateYoutubeId;
/**
 * Generate a ID prefix for media assets, like `Presentation-ID_HB` if the
 * path of the media file is `10_Presentation-id/HB/example.mp3`.
 *
 * @param filePath - The media asset file path.
 *
 * @returns The ID prefix.
 */
function generateIdPrefix(filePath) {
    // We need the absolute path
    filePath = path_1.default.resolve(filePath);
    const pathSegments = filePath.split(path_1.default.sep);
    // HB
    const parentDir = pathSegments[pathSegments.length - 2];
    // Match asset type abbreviations, like AB, HB, NB
    if (parentDir.length !== 2 || (parentDir.match(/[A-Z]{2,}/) == null)) {
        return;
    }
    const assetTypeAbbreviation = parentDir;
    // 20_Strawinsky-Petruschka
    const subParentDir = pathSegments[pathSegments.length - 3];
    // Strawinsky-Petruschka
    const presentationId = subParentDir.replace(/^[0-9]{2,}_/, '');
    // Strawinsky-Petruschka_HB
    const idPrefix = `${presentationId}_${assetTypeAbbreviation}`;
    return idPrefix;
}
exports.generateIdPrefix = generateIdPrefix;
