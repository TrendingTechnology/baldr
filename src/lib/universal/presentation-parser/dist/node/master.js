"use strict";
/**
 * Bundle many exports for the single master slides to import.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterWrapper = exports.StepCollector = exports.Slide = exports.WrappedUriList = exports.extractUrisFromFuzzySpecs = exports.mapStepFieldDefintions = exports.splitHtmlIntoChunks = exports.wrapWords = exports.buildTextStepController = exports.shortenText = exports.convertHtmlToPlainText = exports.Resolver = exports.Sample = exports.Asset = exports.convertMarkdownToHtml = void 0;
const markdown_to_html_1 = require("@bldr/markdown-to-html");
const client_media_models_1 = require("@bldr/client-media-models");
// Exports
var markdown_to_html_2 = require("@bldr/markdown-to-html");
Object.defineProperty(exports, "convertMarkdownToHtml", { enumerable: true, get: function () { return markdown_to_html_2.convertMarkdownToHtml; } });
var media_resolver_ng_1 = require("@bldr/media-resolver-ng");
Object.defineProperty(exports, "Asset", { enumerable: true, get: function () { return media_resolver_ng_1.Asset; } });
Object.defineProperty(exports, "Sample", { enumerable: true, get: function () { return media_resolver_ng_1.Sample; } });
Object.defineProperty(exports, "Resolver", { enumerable: true, get: function () { return media_resolver_ng_1.Resolver; } });
var string_format_1 = require("@bldr/string-format");
Object.defineProperty(exports, "convertHtmlToPlainText", { enumerable: true, get: function () { return string_format_1.convertHtmlToPlainText; } });
Object.defineProperty(exports, "shortenText", { enumerable: true, get: function () { return string_format_1.shortenText; } });
var dom_manipulator_1 = require("@bldr/dom-manipulator");
Object.defineProperty(exports, "buildTextStepController", { enumerable: true, get: function () { return dom_manipulator_1.buildTextStepController; } });
Object.defineProperty(exports, "wrapWords", { enumerable: true, get: function () { return dom_manipulator_1.wrapWords; } });
Object.defineProperty(exports, "splitHtmlIntoChunks", { enumerable: true, get: function () { return dom_manipulator_1.splitHtmlIntoChunks; } });
var field_1 = require("./field");
Object.defineProperty(exports, "mapStepFieldDefintions", { enumerable: true, get: function () { return field_1.mapStepFieldDefintions; } });
var fuzzy_uri_1 = require("./fuzzy-uri");
Object.defineProperty(exports, "extractUrisFromFuzzySpecs", { enumerable: true, get: function () { return fuzzy_uri_1.extractUrisFromFuzzySpecs; } });
Object.defineProperty(exports, "WrappedUriList", { enumerable: true, get: function () { return fuzzy_uri_1.WrappedUriList; } });
var slide_1 = require("./slide");
Object.defineProperty(exports, "Slide", { enumerable: true, get: function () { return slide_1.Slide; } });
var step_1 = require("./step");
Object.defineProperty(exports, "StepCollector", { enumerable: true, get: function () { return step_1.StepCollector; } });
/**
 * The icon of a master slide. This icon is shown in the documentation or
 * on the left corner of a slide.
 */
class MasterIcon {
    constructor({ name, color, size, showOnSlides, unicodeSymbol }) {
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
        this.unicodeSymbol = unicodeSymbol;
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
    get fieldsDefintion() {
        return this.master.fieldsDefintion;
    }
    get name() {
        return this.master.name;
    }
    get displayName() {
        return this.master.displayName;
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
    collectStepsOnInstantiation(fields, stepCollector) {
        if (this.master.collectStepsOnInstantiation != null) {
            this.master.collectStepsOnInstantiation(fields, stepCollector);
        }
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
        if (this.master.normalizeFieldsInput != null) {
            fields = this.master.normalizeFieldsInput(fields);
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
                fields[name] = (0, markdown_to_html_1.convertNestedMarkdownToHtml)(fields[name]);
            }
        }
        if (this.master.collectFieldsOnInstantiation != null) {
            fields = this.master.collectFieldsOnInstantiation(fields);
        }
        return fields;
    }
    /**
     * After the media resolution.
     */
    finalizeSlide(slide, resolver) {
        if (this.master.collectFieldsAfterResolution != null) {
            const fields = this.master.collectFieldsAfterResolution(slide.fields, resolver);
            slide.fields = fields;
        }
        if (this.master.collectStepsAfterResolution != null) {
            this.master.collectStepsAfterResolution(slide.fields, slide);
        }
        return slide.fields;
    }
    deriveTitleFromFields(fields) {
        if (this.master.deriveTitleFromFields != null) {
            return this.master.deriveTitleFromFields(fields);
        }
    }
    derivePlainTextFromFields(fields) {
        if (this.master.derivePlainTextFromFields != null) {
            return this.master.derivePlainTextFromFields(fields);
        }
        const segments = [];
        for (const fieldName in fields) {
            if (Object.prototype.hasOwnProperty.call(fields, fieldName)) {
                const value = fields[fieldName];
                if (typeof value === 'string') {
                    segments.push(value);
                }
            }
        }
        if (segments.length > 0) {
            return segments.join(' | ');
        }
    }
}
exports.MasterWrapper = MasterWrapper;
