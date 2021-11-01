var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { convertFromYaml } from '@bldr/yaml';
import { DataCutter } from './data-management';
import { SlideCollection } from './slide-collection';
import { Resolver } from '@bldr/media-resolver-ng';
import * as log from '@bldr/log';
export const resolver = new Resolver();
/**
 * @inheritdoc
 */
class Meta {
    constructor(raw) {
        const data = new DataCutter(raw);
        this.ref = data.cutStringNotNull('ref');
        this.uuid = data.cutString('uuid');
        this.title = data.cutStringNotNull('title');
        this.subtitle = data.cutString('subtitle');
        this.subject = data.cutString('subject');
        this.grade = data.cutNumber('grade');
        this.curriculum = data.cutString('curriculum');
        this.curriculumUrl = data.cutString('curriculumUrl');
        data.checkEmpty();
    }
    /**
     * Log to the console.
     */
    log() {
        console.log(log.formatObject(this, { indentation: 2 }));
    }
}
export class Presentation {
    constructor(yamlString) {
        this.rawYamlString = yamlString;
        const data = this.convertFromYaml(yamlString);
        this.meta = this.cutMeta(data);
        this.slides = new SlideCollection(data.cutNotNull('slides'));
        data.checkEmpty();
    }
    cutMeta(data) {
        const meta = data.cutAny('meta');
        const title = data.cutString('title');
        const ref = data.cutString('ref');
        if (meta != null && (title != null || ref != null)) {
            throw new Error('Specify the “title” or “ref” inside or outside of the “meta” property not both!');
        }
        if (meta != null) {
            return new Meta(meta);
        }
        if (title == null || ref == null) {
            throw new Error('Specify both title and ref!');
        }
        return new Meta({ title, ref });
    }
    /**
     * Media URIs in the “ref” can be shorted with the string `./`. The
     * abbreviationn `./` is replaced with the presentation reference and a
     * underscore, for example the media URI
     * `ref:Leitmotivtechnik_VD_Verdeutlichung_Duell-Mundharmonika-Frank` can be
     * shortend with `ref:./VD_Verdeutlichung_Duell-Mundharmonika-Frank`. The
     * abbreviationn `./` is inspired by the UNIX dot notation for the current
     * directory.
     *
     * @param rawYamlString - The raw YAML string of the presentation file.
     * @param metaRef - The reference of the presentation.
     *
     * @returns A raw YAML string with fully expanded media URIs.
     */
    expandMediaRefs(rawYamlString, metaRef) {
        return rawYamlString.replace(/ref:.\//g, `ref:${metaRef}_`);
    }
    /**
     * Convert the raw YAML string into javascript object.
     *
     * @param rawYamlString - The raw YAML string of the presentation file.
     *
     * @returns A data cutter object.
     *
     * @throws {Error} If the media URI references cannot be resolved.
     */
    convertFromYaml(yamlString) {
        var _a;
        let raw = convertFromYaml(yamlString);
        if (yamlString.indexOf('ref:./') > -1) {
            let ref = undefined;
            if (raw.ref != null) {
                ref = raw.ref;
            }
            if (((_a = raw.meta) === null || _a === void 0 ? void 0 : _a.ref) != null) {
                ref = raw.meta.ref;
            }
            if (ref == null) {
                throw new Error('A reference abbreviation was found, but the presentation has no reference meta information.');
            }
            yamlString = this.expandMediaRefs(yamlString, ref);
            this.rawYamlStringExpanded = yamlString;
            raw = convertFromYaml(yamlString);
        }
        return new DataCutter(raw);
    }
    resolveMediaAssets() {
        return __awaiter(this, void 0, void 0, function* () {
            yield resolver.resolve(this.slides.mediaUris, true);
            yield resolver.resolve(this.slides.optionalMediaUris, false);
        });
    }
    /**
     * The first slide of a presentation. It is equivalent to
     * `presentation.slides.flat[0]`.
     */
    get firstSlide() {
        return this.slides.flat[0];
    }
    /**
     * @param no - Slide number starting from 1
     */
    getSlideByNo(no) {
        return this.slides.flat[no - 1];
    }
    /**
     * Log to the console.
     */
    log() {
        this.meta.log();
        for (const slide of this.slides.flat) {
            slide.log();
        }
        const assets = resolver.exportAssets(this.slides.mediaUris);
        for (const asset of assets) {
            console.log(log.formatObject(asset.yaml, { keys: ['title', 'ref'] }));
        }
    }
}
