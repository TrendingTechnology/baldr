"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reference = void 0;
const path_1 = __importDefault(require("path"));
const core_node_1 = require("@bldr/core-node");
const file_reader_writer_1 = require("@bldr/file-reader-writer");
const core_node_2 = require("@bldr/core-node");
const config_ng_1 = require("@bldr/config");
const config = config_ng_1.getConfig();
function readReferencesYaml() {
    const rawReferences = file_reader_writer_1.readYamlFile(path_1.default.join(config.mediaServer.basePath, 'Quellen.yml'));
    const result = {};
    for (const r of rawReferences) {
        const reference = r;
        result[reference.ref] = reference;
    }
    return result;
}
const references = readReferencesYaml();
function getPropertyFromReference(filePath, prop) {
    if (filePath != null) {
        const ref = core_node_2.getBasename(filePath);
        if (references[ref] == null) {
            console.error(`References not found for ${ref} of ${filePath}`);
            return;
        }
        const reference = references[ref];
        if (reference[prop] != null) {
            return reference[prop];
        }
    }
}
/**
 * The meta data type specification “reference”.
 */
exports.reference = {
    title: 'Quelle',
    description: 'Quelle, auf der eine Unterrichtsstunde aufbaut, z. B. Auszüge aus Schulbüchern.',
    detectCategoryByPath: function () {
        return new RegExp('^.*/QL/.*.pdf$');
    },
    abbreviation: 'QL',
    props: {
        title: {
            title: 'Titel der Quelle',
            derive: function ({ data, folderTitles }) {
                if (folderTitles == null) {
                    return 'Quelle';
                }
                let suffix = '';
                if (data.forTeacher != null) {
                    suffix = ' (Lehrerband)';
                }
                return `Quelle zum Thema „${folderTitles.titleAndSubtitle}“${suffix}`;
            },
            overwriteByDerived: true
        },
        referenceTitle: {
            title: 'Title der (übergeordneten Quelle)',
            derive: function ({ filePath }) {
                return getPropertyFromReference(filePath, 'referenceTitle');
            }
        },
        referenceSubtitle: {
            title: 'Untertitel der (übergeordneten Quelle)',
            derive: function ({ filePath }) {
                return getPropertyFromReference(filePath, 'referenceSubtitle');
            }
        },
        author: {
            title: 'Autor',
            derive: function ({ filePath }) {
                return getPropertyFromReference(filePath, 'author');
            }
        },
        publisher: {
            title: 'Verlag',
            description: 'Der Verlagsname ohne „Verlage“ im Titel, z. B. Klett, Diesterweg',
            derive: function ({ filePath }) {
                return getPropertyFromReference(filePath, 'publisher');
            },
            overwriteByDerived: true
        },
        releaseDate: {
            title: 'Erscheinungsdatum',
            derive: function ({ filePath }) {
                return getPropertyFromReference(filePath, 'releaseDate');
            }
        },
        edition: {
            title: 'Auflage',
            description: 'z. B. 1. Auflage des Buchs',
            derive: function ({ filePath }) {
                return getPropertyFromReference(filePath, 'edition');
            }
        },
        pageNos: {
            title: 'Seitenzahlen',
            description: 'Auf welchen Seiten aus der Quelle dieser Auszug zu finden war. Nicht zu verwechseln mit der Seitenanzahl des PDFs.'
        },
        forTeacher: {
            title: 'Lehrerband',
            derive: function ({ filePath }) {
                return getPropertyFromReference(filePath, 'forTeacher');
            }
        },
        isbn: {
            title: 'ISBN-Nummer (13 Stellen)',
            derive: function ({ filePath }) {
                return getPropertyFromReference(filePath, 'isbn');
            }
        },
        pageCount: {
            title: 'Seitenanzahl des PDFs',
            description: 'Die Seitenanzahl dieses PDFs',
            derive({ filePath }) {
                if (filePath == null)
                    return;
                return core_node_1.getPdfPageCount(filePath);
            },
            overwriteByDerived: true
        },
        ocr: {
            title: 'Texterkennung (OCR)',
            description: 'Ergebnis der Texterkennung'
        }
    }
};
