"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.youtube = void 0;
const path_1 = __importDefault(require("path"));
const main_1 = require("../main");
/**
 * The meta data type specification “youtube”.
 */
exports.youtube = {
    title: 'YouTube-Video',
    abbreviation: 'YT',
    detectCategoryByPath: function () {
        return new RegExp('^.*/YT/.*.mp4$');
    },
    relPath({ data, category, oldRelPath }) {
        const oldRelDir = path_1.default.dirname(oldRelPath);
        return path_1.default.join(oldRelDir, `${data.youtubeId}.mp4`);
    },
    props: {
        id: {
            title: 'ID eines YouTube-Videos',
            derive: function ({ data, category }) {
                return `${category.abbreviation}_${data.youtubeId}`;
            },
            overwriteByDerived: true
        },
        title: {
            title: 'Titel eines YouTube-Videos',
            derive: function ({ data }) {
                let title;
                if (data.heading) {
                    title = data.heading;
                }
                else if (data.originalHeading) {
                    title = data.originalHeading;
                }
                else {
                    title = data.youtubeId;
                }
                return `YouTube-Video „${title}“`;
            },
            overwriteByDerived: true
        },
        youtubeId: {
            title: 'Die ID eines YouTube-Videos (z. B. gZ_kez7WVUU)',
            validate: main_1.validateYoutubeId
        },
        heading: {
            title: 'Eigene Überschrift'
        },
        info: {
            title: 'Eigener längerer Informationstext'
        },
        original_heading: {
            title: 'Die orignale Überschrift des YouTube-Videos'
        },
        original_info: {
            title: 'Der orignale Informationstext des YouTube-Videos'
        }
    }
};
