"use strict";
/**
 * Wrap a sample with some custom meta data (mostly a custom title). Allow
 * different input specifications. Allow fuzzy specification of the samples.
 *
 * @module @bldr/wrapped-sample
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWrappedSampleList = exports.getUrisFromWrappedSpecs = exports.WrappedSampleList = exports.WrappedSample = exports.WrappedSpecList = void 0;
const client_media_models_1 = require("@bldr/client-media-models");
const internal_1 = require("./internal");
/**
 * This class holds the specification of a wrapped sample. The sample object
 * itself is not included in this class.
 */
class WrappedSpec {
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
            const match = spec.match(client_media_models_1.MediaUri.regExp);
            if (match != null) {
                this.uri = match[0];
            }
            else {
                throw new Error(`No media URI found in “${spec}”!`);
            }
            let title = spec.replace(client_media_models_1.MediaUri.regExp, '');
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
        if (!this.uri.includes('#')) {
            this.uri = this.uri + '#complete';
        }
    }
}
/**
 * This class holds the specification of a list of wrapped samples. The sample
 * objects itself are not included in this class.
 */
class WrappedSpecList {
    /**
     * @param spec - This input options are available:
     *
     *   1. The sample URI as a string (for example: `ref:Fuer-Elise_HB`).
     *   2. An object with the mandatory property `uri` (for example:
     *      `{ uri: 'ref:Fuer-Elise_HB' }`).
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
            this.specs.push(new WrappedSpec(sampleSpec));
        }
    }
    /**
     * Get the URI of all wrapped samples.
     */
    get uris() {
        const uris = new Set();
        for (const spec of this.specs) {
            uris.add(spec.uri);
        }
        return uris;
    }
    *[Symbol.iterator]() {
        for (const spec of this.specs) {
            yield spec;
        }
    }
}
exports.WrappedSpecList = WrappedSpecList;
/**
 * This class holds the resolve sample object.
 */
class WrappedSample {
    constructor(spec) {
        this.spec = spec;
        const sample = internal_1.sampleCache.get(this.spec.uri);
        if (sample == null) {
            throw new Error(`The sample “${this.spec.uri}” couldn’t be loaded.`);
        }
        this.sample = sample;
    }
    /**
     * The manually set custom title or, if not set, the `titleSafe` of the
     * `sample`.
     *
     * We have to use a getter, because the sample may not be resolved at the
     * constructor time.
     */
    get titleSafe() {
        if (this.spec.customTitle != null) {
            return this.spec.customTitle;
        }
        if (this.sample.titleSafe != null) {
            return this.sample.titleSafe;
        }
    }
    getSample() {
        return this.sample;
    }
    getAsset() {
        return this.getSample().asset;
    }
}
exports.WrappedSample = WrappedSample;
class WrappedSampleList {
    constructor(specs) {
        this.samples = [];
        for (const spec of new WrappedSpecList(specs)) {
            this.samples.push(new WrappedSample(spec));
        }
    }
    *[Symbol.iterator]() {
        for (const sample of this.samples) {
            yield sample;
        }
    }
    /**
     * If the wrapped sample list has only one sample in the list and the samples
     * of the first included asset are more than one, than return this sample
     * collection.
     */
    getSamplesFromFirst() {
        if (this.samples.length === 1) {
            const sample = this.samples[0];
            const asset = sample.getAsset();
            if (asset.samples != null) {
                const samples = asset.samples;
                if (samples.size > 1) {
                    return samples;
                }
            }
        }
    }
}
exports.WrappedSampleList = WrappedSampleList;
function getUrisFromWrappedSpecs(spec) {
    return new WrappedSpecList(spec).uris;
}
exports.getUrisFromWrappedSpecs = getUrisFromWrappedSpecs;
function getWrappedSampleList(spec) {
    return new WrappedSampleList(spec);
}
exports.getWrappedSampleList = getWrappedSampleList;
