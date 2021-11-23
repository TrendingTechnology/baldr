"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.worksheet = void 0;
const path_1 = __importDefault(require("path"));
const core_node_1 = require("@bldr/core-node");
/**
 * The meta data type specification “worksheet”.
 */
exports.worksheet = {
    title: 'Arbeitsblatt',
    abbreviation: 'TX',
    detectCategoryByPath: function () {
        return new RegExp('^.*/TX/.*.pdf$');
    },
    props: {
        title: {
            title: 'Titel',
            derive: function ({ folderTitles, filePath }) {
                if (folderTitles == null || filePath == null) {
                    return 'Arbeitsblatt';
                }
                const match = filePath.match(new RegExp(`${path_1.default.sep}([^${path_1.default.sep}]+)\\.pdf`));
                let baseName = 'Arbeitsblatt';
                if (match != null) {
                    baseName = match[1];
                }
                return `${baseName} zum Thema „${folderTitles.titleAndSubtitle}“`;
            },
            overwriteByDerived: true
        },
        pageCount: {
            title: 'Seitenanzahl des PDFs',
            description: 'Die Seitenanzahl dieses PDFs',
            derive({ filePath }) {
                if (filePath != null) {
                    return (0, core_node_1.getPdfPageCount)(filePath);
                }
            },
            overwriteByDerived: true
        }
    }
};
