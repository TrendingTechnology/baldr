"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SampleData = void 0;
const core_browser_1 = require("@bldr/core-browser");
/**
 * We fade in very short and smoothly to avoid audio artefacts.
 */
const defaultFadeInSec = 0.3;
/**
 * We never stop. Instead we fade out very short and smoothly.
 */
const defaultFadeOutSec = 1;
class SampleData {
    constructor(asset, yaml) {
        /**
         * @inheritdoc
         */
        this.startTimeSec = 0;
        this.asset = asset;
        this.yaml = yaml;
        if (this.yaml.ref == null) {
            this.yaml.ref = 'complete';
        }
        if (this.yaml.startTime != null) {
            this.startTimeSec = this.convertToSeconds(this.yaml.startTime);
        }
        if (this.yaml.duration != null && this.yaml.endTime != null) {
            throw new Error('Specifiy duration or endTime not both. They are mutually exclusive.');
        }
        if (this.yaml.duration != null) {
            this.durationSec = this.convertToSeconds(this.yaml.duration);
        }
        else if (this.yaml.endTime != null) {
            this.durationSec =
                this.convertToSeconds(this.yaml.endTime) - this.startTimeSec;
        }
        if (this.yaml.fadeIn != null) {
            this.fadeInSec_ = this.convertToSeconds(this.yaml.fadeIn);
        }
        if (this.yaml.fadeOut != null) {
            this.fadeOutSec_ = this.convertToSeconds(this.yaml.fadeOut);
        }
        this.shortcut = this.yaml.shortcut;
    }
    /**
     * Convert strings to numbers, so we can use them as seconds.
     */
    convertToSeconds(timeIntervaleString) {
        return (0, core_browser_1.convertDurationToSeconds)(timeIntervaleString);
    }
    /**
     * @inheritdoc
     */
    get ref() {
        const ref = this.yaml.ref == null ? 'complete' : this.yaml.ref;
        return `${this.asset.ref}#${ref}`;
    }
    /**
     * @inheritdoc
     */
    get title() {
        if (this.yaml.title != null) {
            return this.yaml.title;
        }
        if (this.yaml.ref != null && this.yaml.ref !== 'complete') {
            return this.yaml.ref;
        }
        return 'komplett';
    }
    /**
     * @inheritdoc
     */
    get titleSafe() {
        if (this.yaml.ref === 'complete') {
            return this.asset.titleSafe;
        }
        else {
            return `${this.title} (${this.asset.titleSafe})`;
        }
    }
    /**
     * @inheritdoc
     */
    get artistSafe() {
        let artist = null;
        let composer = null;
        if (this.asset.yaml.artist != null) {
            artist = `<em class="person">${this.asset.yaml.artist}</em>`;
        }
        if (this.asset.yaml.composer != null) {
            composer = `<em class="person">${this.asset.yaml.composer}</em>`;
        }
        if (artist != null && composer != null) {
            return `${composer} (${artist})`;
        }
        else if (artist != null && composer == null) {
            return artist;
        }
        else if (artist == null && composer != null) {
            return composer;
        }
    }
    /**
     * @inheritdoc
     */
    get yearSafe() {
        if (this.asset.yaml.creationDate != null) {
            return this.asset.yaml.creationDate;
        }
        else if (this.asset.yaml.year != null) {
            return this.asset.yaml.year;
        }
    }
    /**
     * @inheritdoc
     */
    get fadeInSec() {
        if (this.fadeInSec_ == null) {
            return defaultFadeInSec;
        }
        else {
            return this.fadeInSec_;
        }
    }
    /**
     * @inheritdoc
     */
    get fadeOutSec() {
        if (this.fadeOutSec_ == null) {
            return defaultFadeOutSec;
        }
        else {
            return this.fadeOutSec_;
        }
    }
}
exports.SampleData = SampleData;
