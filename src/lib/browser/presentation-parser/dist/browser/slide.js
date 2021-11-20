import { convertToString } from '@bldr/core-browser';
import { shortenText } from '@bldr/string-format';
import * as log from '@bldr/log';
import { DataCutter } from './data-management';
import { masterCollection } from './master-collection';
import { StepCollector } from './step';
import { WrappedUriList } from './fuzzy-uri';
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
export class Slide {
    constructor(raw, no, level) {
        this.stepCollector = new StepCollector();
        this.no = no;
        this.level = level;
        const data = new DataCutter(raw);
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
        const masterNames = Object.keys(masterCollection);
        const intersection = masterNames.filter(masterName => data.keys.includes(masterName));
        if (intersection.length === 0) {
            throw new Error(`No master slide found: ${convertToString(data.raw)}`);
        }
        if (intersection.length > 1) {
            throw new Error(`Each slide must have only one master slide: ${convertToString(data.raw)}`);
        }
        return masterCollection[intersection[0]];
    }
    parseAudioOverlay(data) {
        const audioOverlay = data.cutAny('audioOverlay');
        if (audioOverlay != null) {
            return new WrappedUriList(audioOverlay);
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
     * The title of the slide.
     */
    get title() {
        if (this.meta.title != null) {
            return this.meta.title;
        }
        const titleFromFields = this.master.deriveTitleFromFields(this.fields);
        if (titleFromFields != null) {
            return titleFromFields;
        }
        const plainText = this.plainText;
        if (plainText != null) {
            return shortenText(plainText);
        }
        return this.master.name;
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
