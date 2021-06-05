/**
 * Wrap a sample with some custom meta data (mostly a custom title). Allow
 * different input specifications. Allow fuzzy specification of the samples.
 *
 * @module @bldr/wrapped-sample
 */
import { MediaUri } from '@bldr/client-media-models';
/**
 * This class holds the specification of a wrapped sample. The sample object
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
            const match = spec.match(MediaUri.regExp);
            if (match != null) {
                this.uri = match[0];
            }
            else {
                throw new Error(`No media URI found in “${spec}”!`);
            }
            let title = spec.replace(MediaUri.regExp, '');
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
/**
 * This class holds the specification of a list of wrapped samples. The sample
 * objects itself are not included in this class.
 */
export class WrappedSampleSpecList {
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
            this.specs.push(new WrappedSampleSpec(sampleSpec));
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
export function getUrisFromWrappedSpecs(spec) {
    return new WrappedSampleSpecList(spec).uris;
}
/**
 * This class holds the resolve sample object.
 */
export class WrappedSample {
    constructor(spec, sample) {
        this.spec = spec;
        this.sample = sample;
    }
    /**
     * The manually set custom title or, if not set, the `titleSafe` of the
     * `sample`.
     *
     * We have to use a getter, because the sample may not be resolved at the
     * constructor time.
     */
    get title() {
        if (this.spec.customTitle != null) {
            return this.spec.customTitle;
        }
        if (this.sample.titleSafe != null) {
            return this.sample.titleSafe;
        }
    }
}
export class WrappedSampleList {
    constructor() {
        this.samples = [];
    }
    add(spec, sample) {
        this.samples.push(new WrappedSample(spec, sample));
    }
    *[Symbol.iterator]() {
        for (const sample of this.samples) {
            yield sample;
        }
    }
}
