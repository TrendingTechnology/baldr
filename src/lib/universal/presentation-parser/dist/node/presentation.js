"use strict";
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
exports.Presentation = exports.resolver = void 0;
const yaml_1 = require("@bldr/yaml");
const media_resolver_ng_1 = require("@bldr/media-resolver-ng");
const log = require("@bldr/log");
const data_management_1 = require("./data-management");
const slide_collection_1 = require("./slide-collection");
exports.resolver = new media_resolver_ng_1.Resolver();
/**
 * @inheritdoc
 */
class Meta {
    constructor(raw) {
        const data = new data_management_1.DataCutter(raw);
        this.ref = data.cutStringNotNull('ref');
        this.uuid = data.cutString('uuid');
        this.title = data.cutStringNotNull('title');
        this.subtitle = data.cutString('subtitle');
        this.subject = data.cutString('subject');
        this.grade = data.cutNumber('grade');
        this.curriculum = data.cutString('curriculum');
        this.curriculumUrl = data.cutString('curriculumUrl');
        this.path = data.cutString('path');
        data.checkEmpty();
    }
    /**
     * Log to the console.
     */
    log() {
        log.infoAny(log.formatObject(this, { indentation: 2 }));
    }
}
class Presentation {
    constructor(yamlString) {
        this.rawYamlString = yamlString;
        const data = this.convertFromYaml(yamlString);
        this.meta = this.cutMeta(data);
        this.slides = new slide_collection_1.SlideCollection(data.cutNotNull('slides'));
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
     * Merge two sources to build a presentation from. A the moment only the
     * meta.path property is taken from the raw presentation object.
     *
     * @param yamlString - The presentation as a YAML string
     * @param raw - A raw presentation object (as stored in the MongoDB).
     *
     * @returns A newly created presentation.
     */
    static mergeYamlStringWithRaw(yamlString, raw) {
        var _a;
        const presentation = new Presentation(yamlString);
        if (((_a = raw === null || raw === void 0 ? void 0 : raw.meta) === null || _a === void 0 ? void 0 : _a.path) != null && presentation.meta.path == null) {
            presentation.meta.path = raw.meta.path;
        }
        return presentation;
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
        let raw = (0, yaml_1.convertFromYaml)(yamlString);
        if (yamlString.includes('ref:./')) {
            let ref;
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
            raw = (0, yaml_1.convertFromYaml)(yamlString);
        }
        return new data_management_1.DataCutter(raw);
    }
    /**
     * The relative path of parent directory, for example
     * `12/20_Tradition/10_Umgang-Tradition/10_Futurismus`.
     */
    get parentDir() {
        if (this.meta.path != null) {
            return this.meta.path.replace(/\/[^/]*\.baldr\.yml/, '');
        }
    }
    resolve() {
        return __awaiter(this, void 0, void 0, function* () {
            let assets = yield exports.resolver.resolve(this.slides.mediaUris, true);
            assets = assets.concat(yield exports.resolver.resolve(this.slides.optionalMediaUris, false));
            for (const slide of this.slides) {
                slide.master.finalizeSlide(slide, exports.resolver);
            }
            return assets;
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
     * @param ref - The slide reference.
     *
     * ```yml
     * - ref: reference
     *   generic: slide
     * ```
     */
    getSlideByRef(ref) {
        if (this.slides.withRef[ref] != null) {
            return this.slides.withRef[ref];
        }
    }
    /**
     * Log to the console.
     */
    log() {
        this.meta.log();
        for (const slide of this.slides.flat) {
            slide.log();
        }
        const assets = exports.resolver.exportAssets(this.slides.mediaUris);
        for (const asset of assets) {
            log.verboseAny(log.formatObject(asset.meta, { keys: ['title', 'ref'] }));
        }
    }
}
exports.Presentation = Presentation;
