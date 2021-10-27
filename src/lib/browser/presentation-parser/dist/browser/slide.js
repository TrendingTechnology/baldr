import { DataCutter } from './data-management';
import { convertToString } from '@bldr/core-browser';
import { masterCollection } from './master/_master';
/**
 * The meta data of a slide. Each slide object owns one meta data object.
 */
export class SlideMetaData {
    /**
     * @param {Object} rawSlideObject
     */
    constructor(data) {
        this.ref = data.cutString('ref');
        this.title = data.cutString('title');
        this.description = data.cutString('description');
        this.source = data.cutString('source');
    }
}
export class Slide {
    constructor(raw, no, level) {
        this.no = no;
        this.level = level;
        const data = new DataCutter(raw);
        this.metaData = new SlideMetaData(data);
        this.master = this.detectMaster(data);
    }
    detectMaster(data) {
        const masterNames = Object.keys(masterCollection);
        const intersection = masterNames.filter(masterName => data.keys.includes(masterName));
        console.log(data);
        if (intersection.length === 0) {
            throw new Error(`No master slide found: ${convertToString(data.raw)}`);
        }
        if (intersection.length > 1) {
            throw new Error(`Each slide must have only one master slide: ${convertToString(data.raw)}`);
        }
        return masterCollection[intersection[0]];
    }
}
