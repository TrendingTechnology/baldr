"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkTypeAbbreviations = exports.checkForTwoLetterDir = exports.getTwoLetterRegExp = exports.getTwoLetterAbbreviations = exports.isValidTwoLetterAbbreviation = exports.abbreviations = void 0;
const path_1 = __importDefault(require("path"));
const config_1 = require("@bldr/config");
const config = config_1.getConfig();
exports.abbreviations = config.twoLetterAbbreviations;
function isValidTwoLetterAbbreviation(abbreviation) {
    return exports.abbreviations[abbreviation] != null;
}
exports.isValidTwoLetterAbbreviation = isValidTwoLetterAbbreviation;
function getTwoLetterAbbreviations() {
    return Object.keys(exports.abbreviations);
}
exports.getTwoLetterAbbreviations = getTwoLetterAbbreviations;
function getTwoLetterRegExp() {
    return '(' + getTwoLetterAbbreviations().join('|') + ')';
}
exports.getTwoLetterRegExp = getTwoLetterRegExp;
/**
 * Check if the given file path is in a valid two letter directory.
 *
 * @param filePath A file path, for example
 * `../30_Funktionen-Filmmusik/HB/Bach_Aria-Orchestersuite.m4a.yml`
 *
 * @return True if the file path is in a valid two letter directory, else false.
 */
function checkForTwoLetterDir(filePath) {
    const pathSegments = filePath.split(path_1.default.sep);
    // HB
    const twoLetterDir = pathSegments[pathSegments.length - 2];
    // Match asset type abbreviations, like AB, HB, NB
    if (twoLetterDir != null &&
        twoLetterDir.length === 2 &&
        twoLetterDir.match(/[A-Z]{2,}/) != null) {
        return isValidTwoLetterAbbreviation(twoLetterDir);
    }
    return false;
}
exports.checkForTwoLetterDir = checkForTwoLetterDir;
function checkTypeAbbreviations(categoryCollection) {
    for (const name in categoryCollection) {
        const category = categoryCollection[name];
        if (category.abbreviation != null &&
            !isValidTwoLetterAbbreviation(category.abbreviation)) {
            throw new Error(`Unkown two letter abbreviation ${category.abbreviation}`);
        }
    }
}
exports.checkTypeAbbreviations = checkTypeAbbreviations;
