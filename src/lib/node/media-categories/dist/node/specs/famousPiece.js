"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.famousPiece = void 0;
const file_reader_writer_1 = require("@bldr/file-reader-writer");
const path_1 = __importDefault(require("path"));
/**
 * The meta data type specification “famousePiece”.
 */
exports.famousPiece = {
    title: 'Bekanntes Stück',
    detectCategoryByPath: new RegExp('^.*/Personen/\\w/.*(m4a|mp3)$'),
    props: {
        famousPieceFrom: {
            title: 'Bekanntes Stück von',
            description: 'Der/die Interpret/in Komponist/in eines bekannten Musikstücks.',
            derive: function ({ filePath }) {
                if (filePath != null) {
                    const match = filePath.match(/^.*\/Personen\/\w/);
                    if (match != null) {
                        const prefix = match[0];
                        const personYaml = file_reader_writer_1.readYamlFile(path_1.default.join(prefix, 'main.jpg.yml'));
                        return personYaml.personId;
                    }
                }
            },
            overwriteByDerived: true
        }
    }
};
