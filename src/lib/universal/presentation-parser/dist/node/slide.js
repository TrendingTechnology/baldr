"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slide = void 0;
const core_browser_1 = require("@bldr/core-browser");
const string_format_1 = require("@bldr/string-format");
const log = require("@bldr/log");
const data_management_1 = require("./data-management");
const master_collection_1 = require("./master-collection");
const step_1 = require("./step");
const fuzzy_uri_1 = require("./fuzzy-uri");
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
        // - camera
        if (typeof data.raw === 'string' && masterNames.includes(data.raw)) {
            return master_collection_1.masterCollection[data.raw];
        }
        if (intersection.length === 0) {
            throw new Error(`No master slide found: ${(0, core_browser_1.convertToString)(data.raw)}`);
        }
        if (intersection.length > 1) {
            throw new Error(`Each slide must have only one master slide: ${(0, core_browser_1.convertToString)(data.raw)}`);
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
    get plainText() {
        return this.master.derivePlainTextFromFields(this.fields);
    }
    /**
     * The title of the slide. The HTML tags are removed. First the metadata field
     * `title` (`- title: Title`) is used, then a string obtained from the master
     * hook `deriveTitleFromFields`, then the getter `this.plainText` and finally
     * the master name.
     */
    get title() {
        if (this.meta.title != null) {
            return (0, string_format_1.shortenText)(this.meta.title, { stripTags: true });
        }
        const titleFromFields = this.master.deriveTitleFromFields(this.fields);
        if (titleFromFields != null) {
            return (0, string_format_1.shortenText)(titleFromFields, { stripTags: true });
        }
        const plainText = this.plainText;
        if (plainText != null) {
            return (0, string_format_1.shortenText)(plainText, { stripTags: true });
        }
        return this.master.displayName;
    }
    /**
     *
     */
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
        log.info('%s%s', [unicodeSymbol, this.detailedTitle]);
        for (const step of this.steps) {
            log.verbose('\t\tNr. %s: %s', [step.no, step.title]);
        }
    }
}
exports.Slide = Slide;
