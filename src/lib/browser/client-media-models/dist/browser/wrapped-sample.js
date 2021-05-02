import { MediaUri } from './media-uri';
/**
 * Wrap a sample with some meta data (mostly a custom title). Allow different
 * input specifications.
 *
 * @see {@link module:@bldr/media-client.WrappedSampleList}
 * @see {@link module:@bldr/lamp/content-file~AudioOverlay}
 */
class WrappedSample {
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
        /**
         * True if the title is set manually.
         *
         * This specification sets the property to `true`.
         * `{ title: 'My Title', uri: 'ref:Fuer-Elise' }`
         */
        this.isTitleSetManually = false;
        this.isTitleSetManually = false;
        // string
        if (typeof spec === 'string') {
            if (spec.match(MediaUri.regExp) != null) {
                const match = spec.match(MediaUri.regExp);
                if (match != null) {
                    this.uri = match[0];
                }
                let title = spec.replace(MediaUri.regExp, '');
                if (title != null) {
                    title = title.trim();
                    this.title = title;
                    this.isTitleSetManually = true;
                }
            }
            else {
                throw new Error(`No media URI found in “${spec}”!`);
            }
            // interface SimpleSampleSpec
        }
        else {
            const simpleSample = spec;
            this.uri = simpleSample.uri;
            if (simpleSample.title != null) {
                this.title = simpleSample.title;
                this.isTitleSetManually = true;
            }
        }
    }
    /**
     * The manually set title or, if not set, the `titleSafe` of the `sample`.
     *
     * We have to use a getter, because the sample may not be resolved at
     * the constructor time.
     */
    get titleSafe() {
        var _a;
        if (this.title != null)
            return this.title;
        if (((_a = this.sample) === null || _a === void 0 ? void 0 : _a.titleSafe) != null)
            return this.sample.titleSafe;
    }
}
/**
 * Wrap some samples with metadata. Allow fuzzy specification of the samples.
 * Normalize the input.
 *
 * @see {@link module:@bldr/media-client~WrappedSample}
 * @see {@link module:@bldr/lamp/content-file~AudioOverlay}
 */
export class WrappedSampleList {
    /**
     * @param spec - Different input specifications are
     *   possible:
     *
     *   1. The sample URI as a string (for example: `ref:Fuer-Elise_HB`).
     *   2. An object with the mandatory property `uri` (for example:
     *      `{ uri: 'ref:Fuer-Elise_HB'}`).
     *   3. An instance of the class `Sample`.
     *   4. An array
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
        this.samples = [];
        for (const sampleSpec of specArray) {
            this.samples.push(new WrappedSample(sampleSpec));
        }
        this.isTitleSetManually = false;
        if (this.samples[0].isTitleSetManually) {
            this.isTitleSetManually = true;
        }
    }
    /**
     * Get the URI of all wrapped samples.
     */
    get uris() {
        const uris = [];
        for (const wrappedSample of this.samples) {
            if (wrappedSample.uri != null) {
                uris.push(wrappedSample.uri);
            }
        }
        return uris;
    }
}
