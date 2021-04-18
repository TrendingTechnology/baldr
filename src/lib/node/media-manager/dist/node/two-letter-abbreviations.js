"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkTypeAbbreviations = exports.checkForTwoLetterDir = exports.getTwoLetterAbbreviations = exports.isValidTwoLetterAbbreviation = void 0;
const path_1 = __importDefault(require("path"));
const abbreviations = {
    AB: 'Arbeitsblatt',
    BD: 'Bild',
    EP: 'Example',
    FT: 'Foto',
    GN: 'Graphische Notation',
    GR: 'Gruppe',
    HB: 'Hörbeispiel',
    IN: 'Instrument',
    LD: 'Song / Lied',
    LT: 'Lückentext',
    NB: 'Notenbeispiel',
    PR: 'Person',
    PT: 'Partitur',
    QL: 'Quelle',
    SF: 'Schulfunk',
    TX: 'TeX-Dateien',
    VD: 'Video-Datei',
    YT: 'YouTube-Video'
};
function isValidTwoLetterAbbreviation(abbreviation) {
    return abbreviations[abbreviation] != null;
}
exports.isValidTwoLetterAbbreviation = isValidTwoLetterAbbreviation;
function getTwoLetterAbbreviations() {
    return Object.keys(abbreviations);
}
exports.getTwoLetterAbbreviations = getTwoLetterAbbreviations;
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
    if (twoLetterDir != null && twoLetterDir.length === 2 && (twoLetterDir.match(/[A-Z]{2,}/) != null)) {
        return isValidTwoLetterAbbreviation(twoLetterDir);
    }
    return false;
}
exports.checkForTwoLetterDir = checkForTwoLetterDir;
function checkTypeAbbreviations(typeSpecs) {
    for (const typeName in typeSpecs) {
        const typeSpec = typeSpecs[typeName];
        if (typeSpec.abbreviation != null && !isValidTwoLetterAbbreviation(typeSpec.abbreviation)) {
            throw new Error(`Unkown two letter abbreviation ${typeSpec.abbreviation}`);
        }
    }
}
exports.checkTypeAbbreviations = checkTypeAbbreviations;
