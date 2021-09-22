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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateIdPrefix = exports.validateYoutubeId = exports.validateUuid = exports.validateMediaId = exports.validateDate = exports.twoLetterAbbreviations = exports.categoriesManagement = exports.getTwoLetterRegExp = void 0;
const path_1 = __importDefault(require("path"));
const client_media_models_1 = require("@bldr/client-media-models");
const two_letter_abbreviations_1 = require("./two-letter-abbreviations");
var two_letter_abbreviations_2 = require("./two-letter-abbreviations");
Object.defineProperty(exports, "getTwoLetterRegExp", { enumerable: true, get: function () { return two_letter_abbreviations_2.getTwoLetterRegExp; } });
exports.categoriesManagement = __importStar(require("./management"));
__exportStar(require("./specs"), exports);
exports.twoLetterAbbreviations = two_letter_abbreviations_1.abbreviations;
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
    return (value.match(client_media_models_1.MediaUri.regExp) != null);
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
    const mimeTypeAbbreviation = parentDir;
    // 20_Strawinsky-Petruschka
    const subParentDir = pathSegments[pathSegments.length - 3];
    // Strawinsky-Petruschka
    const presentationId = subParentDir.replace(/^[0-9]{2,}_/, '');
    // Strawinsky-Petruschka_HB
    const idPrefix = `${presentationId}_${mimeTypeAbbreviation}`;
    return idPrefix;
}
exports.generateIdPrefix = generateIdPrefix;
