"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slide = exports.SlideMetaData = void 0;
const data_management_1 = require("./data-management");
const core_browser_1 = require("@bldr/core-browser");
const master_collection_1 = require("./master-collection");
/**
 * The meta data of a slide. Each slide object owns one meta data object.
 */
class SlideMetaData {
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
exports.SlideMetaData = SlideMetaData;
class Slide {
    constructor(raw, no, level) {
        this.no = no;
        this.level = level;
        const data = new data_management_1.DataCutter(raw);
        this.metaData = new SlideMetaData(data);
        this.master = this.detectMaster(data);
        this.fields = this.master.normalizeFields(data.cutAny(this.master.name));
        this.mediaUris = this.master.processMediaUris(this.fields);
        this.optionalMediaUris = this.master.processOptionalMediaUris(this.fields);
    }
    detectMaster(data) {
        const masterNames = Object.keys(master_collection_1.masterCollection);
        const intersection = masterNames.filter(masterName => data.keys.includes(masterName));
        if (intersection.length === 0) {
            throw new Error(`No master slide found: ${core_browser_1.convertToString(data.raw)}`);
        }
        if (intersection.length > 1) {
            throw new Error(`Each slide must have only one master slide: ${core_browser_1.convertToString(data.raw)}`);
        }
        return master_collection_1.masterCollection[intersection[0]];
    }
}
exports.Slide = Slide;
