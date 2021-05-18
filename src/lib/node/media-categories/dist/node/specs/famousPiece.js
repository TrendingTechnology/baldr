"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.famousPiece = void 0;
const path_1 = __importDefault(require("path"));
/**
 * The meta data type specification “famousePiece”.
 */
exports.famousPiece = {
    title: 'Bekanntes Stück',
    detectCategoryByPath: new RegExp('^.*/Personen/\\w/.*(m4a|mp3)$'),
    props: {
        famousPieceFrom: {
            title: 'Bekanntest Stück von',
            description: 'Der/die Interpret/in Komponist/in eines bekannten Musikstücks.',
            derive: function ({ filePath }) {
                if (filePath != null) {
                    return path_1.default.dirname(filePath);
                }
            },
            overwriteByDerived: true
        }
    }
};
