"use strict";
/**
 * Wrap a sample with some custom meta data (mostly a custom title). Allow
 * different input specifications. Allow fuzzy specification of the samples.
 *
 * @module @bldr/wrapped-sample
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WrappedSampleSpecList = void 0;
const media_uri_1 = require("./media-uri");
const cache_1 = require("./cache");
/**
 * This class holds the specification of the wrapped sample. The sample object
 * itself is not included in this class.
 */
class WrappedSampleSpec {
    /**
     * @param spec - Different input specifications are
     *   possible:
     *
     *   1. The sample URI as a string (for example: `ref:Fuer-Elise_HB`).
     *   2. The sample URI inside the title text. (for example
     *      `ref:Fuer-Elise_HB Für Elise` or `Für Elise ref:Fuer-Elise_HB`)
     *   3. An object with the mandatory property `uri` (for example:
     *      `{ uri: 'ref:Fuer-Elise_HB'}`).
     */
    constructor(spec) {
        // string
        if (typeof spec === 'string') {
            const match = spec.match(media_uri_1.MediaUri.regExp);
            if (match != null) {
                this.uri = match[0];
            }
            else {
                throw new Error(`No media URI found in “${spec}”!`);
            }
            let title = spec.replace(media_uri_1.MediaUri.regExp, '');
            if (title != null && title !== '') {
                title = title.trim();
                title = title.replace(/\s{2,}/g, ' ');
                this.customTitle = title;
            }
            // interface SimpleSampleSpec
        }
        else {
            const simpleSample = spec;
            this.uri = simpleSample.uri;
            if (simpleSample.title != null) {
                this.customTitle = simpleSample.title;
            }
        }
    }
}
class WrappedSampleSpecList {
    /**
     * @param spec - Different input specifications are
     *   possible:
     *
     *   1. The sample URI as a string (for example: `ref:Fuer-Elise_HB`).
     *   2. An object with the mandatory property `uri` (for example:
     *      `{ uri: 'ref:Fuer-Elise_HB'}`).
     *   3. An array
     */
    constructor(spec) {
        // Make sure we have an array.
        let specArray;
        if (!Array.isArray(spec)) {
            specArray = [spec];
        }
        else {
            specArray = spec;
        }
        this.specs = [];
        for (const sampleSpec of specArray) {
            this.specs.push(new WrappedSampleSpec(sampleSpec));
        }
    }
    /**
     * Get the URI of all wrapped samples.
     */
    get uris() {
        const uris = [];
        for (const spec of this.specs) {
            if (spec.uri != null) {
                uris.push(spec.uri);
            }
        }
        return uris;
    }
}
exports.WrappedSampleSpecList = WrappedSampleSpecList;
/**
 * This class holds the resolve sample object.
 */
class WrappedSample {
    constructor(spec) {
        this.spec = spec;
        const sample = cache_1.sampleCache.get(this.spec.uri);
        if (sample != null) {
            this.sample = sample;
        }
        else {
            throw new Error(`The sample with the URI “${this.spec.uri}” coudn’t be resolved.`);
        }
    }
    /**
     * The manually set custom title or, if not set, the `titleSafe` of the
     * `sample`.
     *
     * We have to use a getter, because the sample may not be resolved at the
     * constructor time.
     */
    get title() {
        if (this.spec.customTitle != null)
            return this.spec.customTitle;
        if (this.sample.titleSafe != null)
            return this.sample.titleSafe;
    }
}
