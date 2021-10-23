"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sample = void 0;
const core_browser_1 = require("@bldr/core-browser");
/**
 * We fade in very short and smoothly to avoid audio artefacts.
 */
const defaultFadeInSec = 0.3;
/**
  * We never stop. Instead we fade out very short and smoothly.
  */
const defaultFadeOutSec = 1;
class Sample {
    constructor(asset, yaml) {
        this.startTimeSec = 0;
        this.asset = asset;
        this.yaml = yaml;
        if (this.yaml.ref == null) {
            this.yaml.ref = 'complete';
        }
        if (this.yaml.startTime != null) {
            this.startTimeSec = this.toSec(this.yaml.startTime);
        }
        if (this.yaml.duration != null && this.yaml.endTime != null) {
            throw new Error('Specifiy duration or endTime not both. They are mutually exclusive.');
        }
        if (this.yaml.fadeIn != null) {
            this.fadeInSec_ = this.toSec(this.yaml.fadeIn);
        }
        if (this.yaml.fadeOut != null) {
            this.fadeOutSec_ = this.toSec(this.yaml.fadeOut);
        }
        this.shortcut = this.yaml.shortcut;
    }
    /**
     * Convert strings to numbers, so we can use them as seconds.
     */
    toSec(timeIntervaleString) {
        return core_browser_1.convertDurationToSeconds(timeIntervaleString);
    }
    get ref() {
        const ref = this.yaml.ref == null ? 'complete' : this.yaml.ref;
        return `${this.asset.ref}#${ref}`;
    }
    get title() {
        if (this.yaml.title != null) {
            return this.yaml.title;
        }
        if (this.yaml.ref != null && this.yaml.ref !== 'complete') {
            return this.yaml.ref;
        }
        return 'komplett';
    }
    get titleSafe() {
        if (this.yaml.ref === 'complete') {
            return this.asset.titleSafe;
        }
        else {
            return `${this.title} (${this.asset.titleSafe})`;
        }
    }
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
    get yearSafe() {
        if (this.asset.yaml.creationDate != null) {
            return this.asset.yaml.creationDate;
        }
        else if (this.asset.yaml.year != null) {
            return this.asset.yaml.year;
        }
    }
    get fadeInSec() {
        if (this.fadeInSec_ == null) {
            return defaultFadeInSec;
        }
        else {
            return this.fadeInSec_;
        }
    }
    get fadeOutSec() {
        if (this.fadeOutSec_ == null) {
            return defaultFadeOutSec;
        }
        else {
            return this.fadeOutSec_;
        }
    }
}
exports.Sample = Sample;
