"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.famousPiece = void 0;
const file_reader_writer_1 = require("@bldr/file-reader-writer");
const path_1 = __importDefault(require("path"));
function readPersonYaml(filePath) {
    const match = filePath.match(/^.*\/Personen\/\w\/.*?\//);
    if (match != null) {
        const prefix = match[0];
        return (0, file_reader_writer_1.readYamlFile)(path_1.default.join(prefix, 'main.jpg.yml'));
    }
}
/**
 * The meta data type specification “famousPiece”.
 */
exports.famousPiece = {
    title: 'Bekanntes Stück',
    detectCategoryByPath: new RegExp('^.*/Personen/\\w/.*/BS/.*(m4a|mp3)$'),
    abbreviation: 'BS',
    props: {
        title: {
            title: 'Titel mit Suffix',
            description: 'An den Titel wird „ (Bekanntes Stück von …)“ angehängt.',
            derive: function ({ data, filePath }) {
                let title = data.title;
                title = title.replace(/ \(Bekanntes Stück.*/, '');
                if (filePath != null) {
                    const personYaml = readPersonYaml(filePath);
                    if ((personYaml === null || personYaml === void 0 ? void 0 : personYaml.name) != null) {
                        return `${title} (Bekanntes Stück von „${personYaml.name}“)`;
                    }
                }
                return title;
            },
            overwriteByDerived: true
        },
        famousPieceFrom: {
            title: 'Bekanntes Stück von',
            description: 'Der/die Interpret/in Komponist/in eines bekannten Musikstücks.',
            derive: function ({ filePath }) {
                if (filePath == null)
                    return;
                const personYaml = readPersonYaml(filePath);
                if (personYaml != null) {
                    return personYaml.personId;
                }
            },
            overwriteByDerived: true
        }
    }
};
