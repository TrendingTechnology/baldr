"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterWrapper = exports.mapStepFieldDefintions = exports.Slide = exports.Resolver = exports.WrappedUriList = exports.extractUrisFromFuzzySpecs = exports.StepCollector = exports.wrapWords = exports.buildTextStepController = exports.convertHtmlToPlainText = exports.convertMarkdownToHtml = void 0;
const markdown_to_html_1 = require("@bldr/markdown-to-html");
const client_media_models_1 = require("@bldr/client-media-models");
var markdown_to_html_2 = require("@bldr/markdown-to-html");
Object.defineProperty(exports, "convertMarkdownToHtml", { enumerable: true, get: function () { return markdown_to_html_2.convertMarkdownToHtml; } });
var core_browser_1 = require("@bldr/core-browser");
Object.defineProperty(exports, "convertHtmlToPlainText", { enumerable: true, get: function () { return core_browser_1.convertHtmlToPlainText; } });
var dom_manipulator_1 = require("@bldr/dom-manipulator");
Object.defineProperty(exports, "buildTextStepController", { enumerable: true, get: function () { return dom_manipulator_1.buildTextStepController; } });
Object.defineProperty(exports, "wrapWords", { enumerable: true, get: function () { return dom_manipulator_1.wrapWords; } });
var step_1 = require("./step");
Object.defineProperty(exports, "StepCollector", { enumerable: true, get: function () { return step_1.StepCollector; } });
var fuzzy_uri_1 = require("./fuzzy-uri");
Object.defineProperty(exports, "extractUrisFromFuzzySpecs", { enumerable: true, get: function () { return fuzzy_uri_1.extractUrisFromFuzzySpecs; } });
Object.defineProperty(exports, "WrappedUriList", { enumerable: true, get: function () { return fuzzy_uri_1.WrappedUriList; } });
var media_resolver_ng_1 = require("@bldr/media-resolver-ng");
Object.defineProperty(exports, "Resolver", { enumerable: true, get: function () { return media_resolver_ng_1.Resolver; } });
var slide_1 = require("./slide");
Object.defineProperty(exports, "Slide", { enumerable: true, get: function () { return slide_1.Slide; } });
const stepFieldDefinitions = {
    selector: {
        description: 'Selektor, der Elemente auswählt, die als Schritte eingeblendet werden sollen.'
    },
    mode: {
        type: String,
        description: '„words“ oder „sentences“'
    },
    subset: {
        type: String,
        description: 'Eine Untermenge von Schritten auswählen (z. B. 1,3,5 oder 2-5).'
    }
};
/**
 * Map step support related fields.
 *
 * @param selectors - At the moment: “selector”, “mode” and “subset”.
 */
function mapStepFieldDefintions(selectors) {
    const result = {};
    for (const selector of selectors) {
        if (stepFieldDefinitions[selector] != null) {
            result[`step${selector.charAt(0).toUpperCase()}${selector
                .substr(1)
                .toLowerCase()}`] = stepFieldDefinitions[selector];
        }
    }
    return result;
}
exports.mapStepFieldDefintions = mapStepFieldDefintions;
/**
 * The icon of a master slide. This icon is shown in the documentation or
 * on the left corner of a slide.
 */
class MasterIcon {
    constructor({ name, color, size, showOnSlides }) {
        if (size != null && !['small', 'large'].includes(size)) {
            throw new Error(`The property “size” of the “MasterIcon” has to be “small” or “large” not ${size}`);
        }
        if (showOnSlides !== undefined && typeof showOnSlides !== 'boolean') {
            throw new Error(`The property “showOnSlide” of the “MasterIcon” has to be “boolean” not ${String(showOnSlides)}`);
        }
        this.name = name;
        this.color = color != null ? color : 'orange';
        this.showOnSlides = showOnSlides != null ? showOnSlides : false;
        this.size = size != null ? size : 'small';
    }
}
/**
 * Wraps a master object. Processes, hides, forwards the field data of the
 * slides and methods.
 */
class MasterWrapper {
    constructor(MasterClass) {
        this.master = new MasterClass();
        this.icon = new MasterIcon(this.master.icon);
    }
    get name() {
        return this.master.name;
    }
    /**
     * Convert to a set and remove sample fragments, e. g. `#complete`
     */
    static processMediaUris(uris) {
        const result = new Set();
        if (uris == null) {
            return result;
        }
        if (typeof uris === 'string') {
            uris = [uris];
        }
        for (const uri of uris) {
            result.add(client_media_models_1.MediaUri.removeFragment(uri));
        }
        return result;
    }
    processMediaUris(fields) {
        if (this.master.collectMediaUris != null && fields != null) {
            return MasterWrapper.processMediaUris(this.master.collectMediaUris(fields));
        }
        return new Set();
    }
    processOptionalMediaUris(fields) {
        if (this.master.collectOptionalMediaUris != null && fields != null) {
            return MasterWrapper.processMediaUris(this.master.collectOptionalMediaUris(fields));
        }
        return new Set();
    }
    generateTexMarkup(fields) {
        if (this.master.generateTexMarkup != null) {
            return this.master.generateTexMarkup(fields);
        }
    }
    /**
     * Before resolving
     */
    initializeFields(fields) {
        if (this.master.shortFormField != null && typeof fields === 'string') {
            const shortform = fields;
            fields = {};
            fields[this.master.shortFormField] = shortform;
        }
        if (this.master.normalizeFields != null) {
            fields = this.master.normalizeFields(fields);
        }
        for (const name in fields) {
            // Raise an error if there is an unknown field.
            if (this.master.fieldsDefintion[name] == null) {
                throw new Error(`The master slide “${this.master.name}” has no field named “${name}”.`);
            }
        }
        for (const name in this.master.fieldsDefintion) {
            const def = this.master.fieldsDefintion[name];
            if (def.required != null && def.required && fields[name] == null) {
                throw new Error(`A field named “${name}” is mandatory for the master slide “${this.master.name}”.`);
            }
            // Set default values
            if (def.default != null && fields[name] == null) {
                fields[name] = def.default;
            }
            // type
            if (def.type != null &&
                typeof def.type === 'function' &&
                fields[name] != null) {
                fields[name] = def.type(fields[name]);
            }
            //  Convert the field marked as containing markup from markdown to HTML.
            if (def.markup != null && def.markup && fields[name] != null) {
                fields[name] = markdown_to_html_1.convertNestedMarkdownToHtml(fields[name]);
            }
        }
        return fields;
    }
    /**
     * After the media resolution.
     */
    finalizeSlide(slide, resolver) {
        if (this.master.collectFields != null) {
            const fields = this.master.collectFields(slide.fields, resolver);
            slide.fields = fields;
        }
        if (this.master.collectStepsLate != null) {
            this.master.collectStepsLate(slide.fields, slide);
        }
        return slide.fields;
    }
}
exports.MasterWrapper = MasterWrapper;
