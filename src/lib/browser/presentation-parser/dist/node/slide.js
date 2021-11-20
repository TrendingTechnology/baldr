"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slide = void 0;
const data_management_1 = require("./data-management");
const core_browser_1 = require("@bldr/core-browser");
const master_collection_1 = require("./master-collection");
const fuzzy_uri_1 = require("./fuzzy-uri");
const step_1 = require("./step");
const log = require("@bldr/log");
/**
 * The meta data of a slide. Each slide object owns one meta data object.
 */
class SlideMeta {
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
class Slide {
    constructor(raw, no, level) {
        this.stepCollector = new step_1.StepCollector();
        this.no = no;
        this.level = level;
        const data = new data_management_1.DataCutter(raw);
        this.meta = new SlideMeta(data);
        this.master = this.detectMaster(data);
        this.fields = this.master.initializeFields(data.cutAny(this.master.name));
        this.mediaUris = this.master.processMediaUris(this.fields);
        this.optionalMediaUris = this.master.processOptionalMediaUris(this.fields);
        this.master.collectStepsOnInstantiation(this.fields, this.stepCollector);
        this.audioOverlay = this.parseAudioOverlay(data);
        // data.checkEmpty()
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
    parseAudioOverlay(data) {
        const audioOverlay = data.cutAny('audioOverlay');
        if (audioOverlay != null) {
            return new fuzzy_uri_1.WrappedUriList(audioOverlay);
        }
    }
    /**
     * If the slide has no steps, then the array remains empty.
     */
    get steps() {
        return this.stepCollector.steps;
    }
    /**
     * The title of the slide.
     */
    get title() {
        if (this.meta.title != null) {
            return this.meta.title;
        }
        return this.master.name;
        // const titleFromProps = this.master.titleFromProps({
        //   props: this.props,
        //   propsMain: this.propsMain,
        //   propsPreview: this.propsPreview
        // })
        // if (titleFromProps) return titleFromProps
        // let plain = this.plainText
        // plain = plain.replace(/\|/g, '')
        // return shortenText(plain)
    }
    get detailedTitle() {
        return `Nr. ${this.no} [${this.master.displayName}]: ${this.title}`;
    }
    /**
     * Log to the console.
     */
    log() {
        const unicodeSymbol = this.master.icon.unicodeSymbol != null
            ? this.master.icon.unicodeSymbol + '\t'
            : '\t';
        log.always('%s%s', [unicodeSymbol, this.detailedTitle]);
    }
}
exports.Slide = Slide;
