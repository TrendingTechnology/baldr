import { convertDurationToSeconds } from '@bldr/string-format';
/**
 * We fade in very short and smoothly to avoid audio artefacts.
 */
const defaultFadeInSec = 0.3;
/**
 * We never stop. Instead we fade out very short and smoothly.
 */
const defaultFadeOutSec = 1;
/**
 * A sample (snippet, sprite) of a media asset which can be played. A sample
 * has typically a start time and a duration. If the start time is missing, the
 * media file gets played from the beginning. If the duration is missing, the
 * whole media file gets played.
 *
 * ```
 *                  currentTimeSec
 *                  |
 *  fadeIn          |        fadeOut
 *         /|-------+------|\           <- mediaElementCurrentVolume_
 *      /   |       |      |   \
 *   /      |       |      |     \
 * #|#######|#######|######|#####|#### <- mediaElement
 *  ^                            ^
 *  startTimeSec                 endTimeSec
 *                         ^
 *                         |
 *                         fadeOutStartTime
 *
 *  | <-      durationSec      ->|
 * ```
 */
export class Sample {
    constructor(asset, yaml) {
        /**
         * The start time in seconds. The sample is played from this start time
         * using the `mediaElement` of the `asset`. It is the “zero” second
         * for the sample.
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
            this.fadeInSec = this.convertToSeconds(this.yaml.fadeIn);
        }
        else {
            this.fadeInSec = defaultFadeInSec;
        }
        if (this.yaml.fadeOut != null) {
            this.fadeOutSec = this.convertToSeconds(this.yaml.fadeOut);
        }
        else {
            this.fadeOutSec = defaultFadeOutSec;
        }
        this.shortcut = this.yaml.shortcut;
    }
    /**
     * Convert strings to numbers, so we can use them as seconds.
     */
    convertToSeconds(timeIntervaleString) {
        return convertDurationToSeconds(timeIntervaleString);
    }
    /**
     * The sample reference is prefixed with `ref:` and suffixed with a sample
     * fragment (`#fragment`), for example `ref:Fuer-Elise#complete`.
     */
    get ref() {
        const ref = this.yaml.ref == null ? 'complete' : this.yaml.ref;
        return `${this.asset.ref}#${ref}`;
    }
    /**
     * The title of the sample. For example `komplett`, `Hook-Line`.
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
     * If the sample is the complete media file get the title of the media file.
     * For example `Glocken (Das große Tor von Kiew)`
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
     * Combined value build from `this.asset.meta.artist` and `this.asset.meta.composer`.
     */
    get artistSafe() {
        let artist = null;
        let composer = null;
        if (this.asset.meta.artist != null) {
            artist = `<em class="person">${this.asset.meta.artist}</em>`;
        }
        if (this.asset.meta.composer != null) {
            composer = `<em class="person">${this.asset.meta.composer}</em>`;
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
     * Combined value build from `this.asset.meta.creationDate` and
     * `this.asset.meta.year`.
     */
    get yearSafe() {
        if (this.asset.meta.creationDate != null) {
            return this.asset.meta.creationDate;
        }
        else if (this.asset.meta.year != null) {
            return this.asset.meta.year;
        }
    }
}
