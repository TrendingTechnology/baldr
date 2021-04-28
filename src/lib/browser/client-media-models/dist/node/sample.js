"use strict";
// import { CustomEventsManager } from './custom-events-manager'
// import { TimeOut } from './timer'
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_browser_1 = require("@bldr/core-browser");
/**
 * A sample (snippet, sprite) of a media file which can be played. A sample
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
class Sample {
    /**
     * @param {ClientMediaAsset} asset
     * @param {object} specs
     * @property {String} specs.title
     * @property {String|Number} specs.id
     * @property {String|Number} specs.startTime - The start time in seconds.
     * @property {String|Number} specs.fadeIn - The fade in time in seconds. The
     *   duration is not affected by this time specification.
     * @property {String|Number} specs.duration - The duration in seconds of
     *   the sample.
     * @property {String|Number} specs.fadeOut - The fade out time in seconds. The
     *   duration is not affected by this time specification.
     * @property {String|Number} specs.endTime - The end time in seconds.
     * @property {String} specs.shortcut - A custom shortcut
     */
    constructor(asset, { title, id, startTime, fadeIn, duration, fadeOut, endTime, shortcut }) {
        /**
         * We fade in very short and smoothly to avoid audio artefacts.
         */
        this.defaultFadeInSec = 0.3;
        /**
         * We never stop. Instead we fade out very short and smoothly.
         */
        this.defaultFadeOutSec = 1;
        /**
         * Number of milliseconds to wait before the media file is played.
         */
        this.defaultPlayDelayMsec = 10;
        /**
         * The start time in seconds. The sample is played from this start time
         * using the `mediaElement` of the `asset`. It is the “zero” second
         * for the sample.
         */
        this.startTimeSec = 0;
        /**
         * The current volume of the parent media Element. This value gets stored
         * when the sample is paused. It is needed to restore the volume.
         */
        this.mediaElementCurrentVolume = 1;
        /**
         * The current time of the parent media Element. This value gets stored
         * when the sample is paused.
         */
        this.mediaElementCurrentTimeSec = 0;
        this.interval = new Interval();
        this.timeOut = new TimeOut();
        this.customEventsManager = new CustomEventsManager();
        this.asset = asset;
        this.title = title;
        if (!id) {
            throw new Error('A sample needs an id.');
        }
        this.id = id;
        this.uri = `${this.asset.uri}#${id}`;
        if (startTime != null) {
            this.startTimeSec = this.toSec(startTime);
        }
        if (duration != null && endTime != null) {
            throw new Error('Specifiy duration or endTime not both. They are mutually exclusive.');
        }
        if (duration != null) {
            this.durationSec_ = this.toSec(duration);
        }
        else if (endTime != null) {
            this.durationSec_ = this.toSec(endTime) - this.startTimeSec;
        }
        if (fadeIn != null) {
            this.fadeInSec_ = this.toSec(fadeIn);
        }
        if (fadeOut != null) {
            this.fadeOutSec_ = this.toSec(fadeOut);
        }
        this.shortcutCustom = shortcut;
        this.interval = new Interval();
        this.timeOut = new TimeOut();
        this.customEventsManager = new CustomEventsManager();
        this.playbackState = 'stopped';
    }
    /**
     * The URI using the `id` authority.
     */
    get uriId() {
        return `${this.asset.id}#${this.id}`;
    }
    /**
     * The URI using the `uuid` authority.
     */
    get uriUuid() {
        return `${this.asset.uri}#${this.id}`;
    }
    /**
     * If the sample is the complete media file get the title of the media file.
     * For example `Glocken (Das große Tor von Kiew)`
     */
    get titleSafe() {
        if (this.id === 'complete') {
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
    /**
     * Convert strings to numbers, so we can use them as seconds.
     */
    toSec(timeIntervaleString) {
        return core_browser_1.convertDurationToSeconds(timeIntervaleString);
    }
    /**
     * The current time of the sample. It starts from zero.
     */
    get currentTimeSec() {
        if (this.mediaElement != null) {
            return this.mediaElement.currentTime - this.startTimeSec;
        }
        return 0;
    }
    /**
     * Time in seconds to fade in.
     */
    get fadeInSec() {
        if (!this.fadeInSec_) {
            return this.defaultFadeInSec;
        }
        else {
            return this.fadeInSec_;
        }
    }
    /**
     * Time in seconds to fade out.
     */
    get fadeOutSec() {
        if (!this.fadeOutSec_) {
            return this.defaultFadeOutSec;
        }
        else {
            return this.fadeOutSec_;
        }
    }
    /**
     * In how many milliseconds we have to start a fade out process.
     */
    get fadeOutStartTimeMsec_() {
        return (this.durationRemainingSec - this.fadeOutSec) * 1000;
    }
    /**
     * The duration of the sample in seconds. If the duration is set on the
     * sample, it is the same as `sample.durationSec_`.
     */
    get durationSec() {
        if (this.durationSec_ == null && this.mediaElement != null) {
            // Samples without duration play until the end fo the media file.
            return this.mediaElement.duration - this.startTimeSec;
        }
        else if (this.durationSec_ != null) {
            return this.durationSec_;
        }
        return 0;
    }
    /**
     * The remaining duration of the sample in seconds.
     */
    get durationRemainingSec() {
        if (this.durationSec_ != null) {
            return this.durationSec_ - this.currentTimeSec;
        }
        return 0;
    }
    /**
     * A number between 0 and 1. 0: the sample starts from the beginning. 1:
     * the sample reaches the end.
     */
    get progress() {
        if (this.durationSec_ == null)
            return 0;
        // for example:
        // current time: 6s duration: 60s
        // 6 / 60 = 0.1
        return this.currentTimeSec / this.durationSec_;
    }
    /**
     * Set the volume and simultaneously the opacity of a video element, to be
     * able to fade out or fade in a video and a audio file.
     */
    set volume(value) {
        if (this.mediaElement == null)
            return;
        this.mediaElement.volume = parseFloat(value.toFixed(2));
        if (this.asset.mimeType === 'video') {
            this.mediaElement.style.opacity = value.toFixed(2);
        }
    }
    /**
     * Fade in. Set the volume to 0 and reach after a time intervale, specified
     * with `duration` the `targetVolume.`
     *
     * @param {Number} targetVolume - End volume value of the fade in process. A
     *   number from 0 - 1.
     * @param {Number} duration - in seconds
     *
     * @async
     *
     * @returns {Promise}
     */
    fadeIn(targetVolume = 1, duration) {
        let durationSafe;
        if (duration == null) {
            durationSafe = this.defaultFadeInSec;
        }
        else {
            durationSafe = duration;
        }
        return new Promise((resolve, reject) => {
            if (this.mediaElement == null)
                return;
            // Fade in can triggered when a fade out process is started and
            // not yet finished.
            this.interval.clear();
            this.customEventsManager.trigger('fadeinbegin');
            this.playbackState = 'fadein';
            let actualVolume = 0;
            this.mediaElement.volume = 0;
            this.mediaElement.play();
            // Normally 0.01 by volume = 1
            const steps = targetVolume / 100;
            // Interval: every X ms reduce volume by step
            // in milliseconds: duration * 1000 / 100
            const stepInterval = durationSafe * 10;
            this.interval.set(() => {
                actualVolume += steps;
                if (actualVolume <= targetVolume) {
                    this.volume = actualVolume;
                }
                else {
                    this.interval.clear();
                    this.customEventsManager.trigger('fadeinend');
                    this.playbackState = 'playing';
                    resolve();
                }
            }, stepInterval);
        });
    }
    /**
     * Start and play a sample from the beginning.
     *
     * @param targetVolume - End volume value of the fade in process. A
     *   number from 0 - 1.
     */
    start(targetVolume) {
        this.playbackState = 'started';
        this.play(targetVolume, this.startTimeSec);
    }
    /**
     * Play a sample from `startTimeSec`.
     *
     * @param targetVolume - End volume value of the fade in process. A
     *   number from 0 - 1.
     * @param startTimeSec - Position in the sample from where to play
     *   the sample
     */
    play(targetVolume, startTimeSec, fadeInSec) {
        if (this.mediaElement == null)
            return;
        if (fadeInSec == null)
            fadeInSec = this.fadeInSec;
        // The start() triggers play with this.startTimeSec. “complete” samples
        // have on this.startTimeSec 0.
        if (startTimeSec != null || startTimeSec === 0) {
            this.mediaElement.currentTime = startTimeSec;
        }
        else if (this.mediaElementCurrentTimeSec) {
            this.mediaElement.currentTime = this.mediaElementCurrentTimeSec;
        }
        else {
            this.mediaElement.currentTime = this.startTimeSec;
        }
        // To prevent AbortError in Firefox, artefacts when switching through the
        // audio files.
        this.timeOut.set(() => {
            this.fadeIn(targetVolume, this.fadeInSec);
            this.scheduleFadeOut();
        }, this.defaultPlayDelayMsec);
    }
    /**
     * Schedule when the fade out process has to start.
     * Always fade out at the end. Maybe the samples are cut without a
     * fade out.
     */
    scheduleFadeOut() {
        this.timeOut.set(() => { this.fadeOut(this.fadeOutSec); }, this.fadeOutStartTimeMsec_);
    }
    /**
     * @param duration - in seconds
     */
    fadeOut(duration) {
        let durationSafe;
        if (duration == null) {
            durationSafe = this.defaultFadeOutSec;
        }
        else {
            durationSafe = duration;
        }
        return new Promise((resolve, reject) => {
            if (this.mediaElement == null)
                return;
            if (this.mediaElement.paused)
                resolve(undefined);
            // Fade out can triggered when a fade out process is started and
            // not yet finished.
            this.interval.clear();
            this.customEventsManager.trigger('fadeoutbegin');
            this.playbackState = 'fadeout';
            // Number from 0 - 1
            let actualVolume = this.mediaElement.volume;
            // Normally 0.01 by volume = 1
            const steps = actualVolume / 100;
            // Interval: every X ms reduce volume by step
            // in milliseconds: duration * 1000 / 100
            const stepInterval = durationSafe * 10;
            this.interval.set(() => {
                actualVolume -= steps;
                if (actualVolume >= 0) {
                    this.volume = actualVolume;
                }
                else {
                    // The video opacity must be set to zero.
                    this.volume = 0;
                    if (this.mediaElement != null)
                        this.mediaElement.pause();
                    this.interval.clear();
                    this.customEventsManager.trigger('fadeoutend');
                    this.playbackState = 'stopped';
                    resolve();
                }
            }, stepInterval);
        });
    }
    /**
     * Stop the playback of a sample and reset the current play position to the
     * beginning of the sample. If the sample is a video, show the poster
     * (the preview image) again by triggering the `load()` method of the
     * corresponding media element.
     *
     * @param fadeOutSec - Duration in seconds to fade out the sample.
     */
    stop(fadeOutSec) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.mediaElement == null || this.mediaElement.paused)
                return;
            yield this.fadeOut(fadeOutSec);
            this.mediaElement.currentTime = this.startTimeSec;
            this.timeOut.clear();
            if (this.asset.mimeType === 'video') {
                this.mediaElement.load();
                this.mediaElement.style.opacity = '1';
            }
        });
    }
    /**
     * Pause the sample at the current position and set the video element to
     * opacity 0. The properties `mediaElementCurrentTimeSec_` and
     * `mediaElementCurrentVolume_` are set or
     * updated.
     */
    pause() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.mediaElement == null)
                return;
            yield this.fadeOut();
            this.timeOut.clear();
            if (this.asset.mimeType === 'video') {
                this.mediaElement.style.opacity = '0';
            }
            this.mediaElementCurrentTimeSec = this.mediaElement.currentTime;
            this.mediaElementCurrentVolume = this.mediaElement.volume;
        });
    }
    /**
     * Toggle between `sample.pause()` and `sample.play()`. If a sample is loaded
     * start this sample.
     */
    toggle(targetVolume = 1) {
        var _a;
        if ((_a = this.mediaElement) === null || _a === void 0 ? void 0 : _a.paused) {
            this.play(targetVolume);
        }
        else {
            this.pause();
        }
    }
    /**
     * Jump to a new time position.
     */
    jump(interval = 10, direction = 'forward') {
        if (this.mediaElement == null)
            return;
        let newPlayPosition;
        const cur = this.currentTimeSec;
        if (direction === 'backward') {
            if (cur - interval > 0) {
                newPlayPosition = cur - interval;
            }
            else {
                newPlayPosition = 0;
            }
        }
        else {
            newPlayPosition = this.currentTimeSec + interval;
            if (cur + interval < this.durationSec) {
                newPlayPosition = cur + interval;
            }
            else {
                newPlayPosition = this.durationSec;
            }
        }
        this.timeOut.clear();
        this.mediaElement.currentTime = this.startTimeSec + newPlayPosition;
        this.scheduleFadeOut();
    }
    /**
     * Jump forwards.
     *
     * @param interval - Time interval in seconds.
     */
    forward(interval = 10) {
        this.jump(interval, 'forward');
    }
    /**
     * Jump backwards.
     *
     * interval - Time interval in seconds.
     */
    backward(interval = 10) {
        this.jump(interval, 'backward');
    }
}
