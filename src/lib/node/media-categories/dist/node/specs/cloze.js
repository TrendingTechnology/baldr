"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloze = void 0;
const path_1 = __importDefault(require("path"));
/**
 * The meta data type specification “cloze”.
 */
exports.cloze = {
    title: 'Lückentext',
    abbreviation: 'LT',
    detectCategoryByPath: function () {
        return new RegExp('^.*/LT/.*.svg$');
    },
    initialize({ data }) {
        if (data.filePath && !data.clozePageNo) {
            const match = data.filePath.match(/(\d+)\.svg/);
            if (match != null)
                data.clozePageNo = parseInt(match[1]);
        }
        return data;
    },
    relPath({ data, oldRelPath }) {
        const oldRelDir = path_1.default.dirname(oldRelPath);
        let pageNo = '';
        if (data.clozePageNo)
            pageNo = `_${data.clozePageNo}`;
        return path_1.default.join(oldRelDir, `Lueckentext${pageNo}.svg`);
    },
    props: {
        id: {
            title: 'Die ID des Lückentexts',
            derive: function ({ data, folderTitles }) {
                let counterSuffix = '';
                if (data.clozePageNo != null) {
                    counterSuffix = `_${data.clozePageNo}`;
                }
                return `${folderTitles.id}_LT${counterSuffix}`;
            },
            overwriteByDerived: true
        },
        title: {
            title: 'Titel des Lückentextes',
            derive: function ({ data, folderTitles }) {
                const clozeData = data;
                let suffix = '';
                if (clozeData.clozePageNo != null && clozeData.clozePageCount != null) {
                    suffix = ` (Seite ${clozeData.clozePageNo} von ${clozeData.clozePageCount})`;
                }
                else if (clozeData.clozePageNo != null && !clozeData.clozePageCount == null) {
                    suffix = ` (Seite ${clozeData.clozePageNo})`;
                }
                return `Lückentext zum Thema „${folderTitles.titleAndSubtitle}“${suffix}`;
            },
            overwriteByDerived: true
        },
        clozePageNo: {
            title: 'Seitenzahl des Lückentextes',
            validate(value) {
                return Number.isInteger(value);
            }
        },
        clozePageCount: {
            title: 'Seitenanzahl des Lückentextes',
            validate(value) {
                return Number.isInteger(value);
            }
        }
    }
};
