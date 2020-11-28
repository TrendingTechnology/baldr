"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slide = void 0;
const core_browser_1 = require("@bldr/core-browser");
const markdown_to_html_1 = require("@bldr/markdown-to-html");
/**
 * Meta informations can be added to each slide. All properties are possibly
 * undefined.
 */
class SlideMetaData {
    constructor(raw) {
        this.raw = raw;
        this.id = this.cutAndConvert('id');
        this.title = this.cutAndConvert('title');
        this.description = this.cutAndConvert('description');
        this.source = this.cutAndConvert('source');
    }
    cutAndConvert(property) {
        const value = this.raw.cut(property);
        if (value) {
            return markdown_to_html_1.convertMarkdownToHtml(value);
        }
    }
}
/**
 * A slide.
 */
class Slide {
    constructor(rawData) {
        const raw = new core_browser_1.RawDataObject(rawData);
        this.meta = new SlideMetaData(raw);
        this.rawData = rawData;
        this.no = 0;
        this.level = 0;
        this.slides = [];
    }
}
exports.Slide = Slide;
