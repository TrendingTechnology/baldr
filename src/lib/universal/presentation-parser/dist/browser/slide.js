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
        /**
         * The scale factor is used to calculate the font size css style property of
         * the root element in the component
         * `src/vue/apps/lamp/src/components/linked-by-routes/SlideView/index.vue`
         */
        this.scaleFactor = 1;
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
        // - camera
        if (typeof data.raw === 'string' && masterNames.includes(data.raw)) {
            return masterCollection[data.raw];
        }
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
     * The title of the slide. The HTML tags are removed. First the metadata field
     * `title` (`- title: Title`) is used, then a string obtained from the master
     * hook `deriveTitleFromFields`, then the getter `this.plainText` and finally
     * the master name.
     */
    get title() {
        if (this.meta.title != null) {
            return shortenText(this.meta.title, { stripTags: true });
        }
        const titleFromFields = this.master.deriveTitleFromFields(this.fields);
        if (titleFromFields != null) {
            return shortenText(titleFromFields, { stripTags: true });
        }
        const plainText = this.plainText;
        if (plainText != null) {
            return shortenText(plainText, { stripTags: true });
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
