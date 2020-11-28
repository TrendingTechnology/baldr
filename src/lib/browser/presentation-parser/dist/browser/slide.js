import { RawDataObject } from '@bldr/core-browser';
import { convertMarkdownToHtml } from '@bldr/markdown-to-html';
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
            return convertMarkdownToHtml(value);
        }
    }
}
/**
 * A slide.
 */
export class Slide {
    constructor(rawData) {
        const raw = new RawDataObject(rawData);
        this.meta = new SlideMetaData(raw);
        this.rawData = rawData;
        this.no = 0;
        this.level = 0;
        this.slides = [];
    }
}
