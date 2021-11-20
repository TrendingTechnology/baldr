import { DataCutter } from './data-management';
import { convertToString } from '@bldr/core-browser';
import { masterCollection } from './master-collection';
import { WrappedUriList } from './fuzzy-uri';
import { StepCollector } from './step';
import * as log from '@bldr/log';
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
    /**
     * Log to the console.
     */
    log() {
        const unicodeSymbol = this.master.icon.unicodeSymbol != null
            ? this.master.icon.unicodeSymbol + '\t'
            : '\t';
        log.always('%sSlide No. %s', [unicodeSymbol, this.no]);
    }
}
