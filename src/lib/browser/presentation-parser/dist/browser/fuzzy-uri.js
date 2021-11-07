/**
 * @file
 * Wrap a media asset or a sample URI with a title in an object. Allow fuzzy
 * specification of the URIs.
 */
import { MediaUri } from '@bldr/client-media-models';
class WrappedUriCollector {
    constructor(spec) {
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
                if (title !== '.' && title !== 'none') {
                    this.title = title;
                }
            }
        }
        else {
            if (spec.uri == null) {
                throw new Error(`No media URI found in “${JSON.stringify(spec)}”!`);
            }
            this.uri = spec.uri;
            if (spec.title != null) {
                this.title = spec.title;
            }
        }
    }
}
/**
 * This class holds a list of wrapped URIs.
 */
export class WrappedUriList {
    constructor(spec) {
        let specArray;
        if (!Array.isArray(spec)) {
            specArray = [spec];
        }
        else {
            specArray = spec;
        }
        this.specs = [];
        for (const sampleSpec of specArray) {
            this.specs.push(new WrappedUriCollector(sampleSpec));
        }
    }
    /**
     * Get all URIs (without sample fragment)
     */
    get uris() {
        const uris = new Set();
        for (const spec of this.specs) {
            uris.add(MediaUri.removeFragment(spec.uri));
        }
        return uris;
    }
    *[Symbol.iterator]() {
        for (const spec of this.specs) {
            yield spec;
        }
    }
}
export function extractUrisFromFuzzySpecs(spec) {
    return new WrappedUriList(spec).uris;
}
