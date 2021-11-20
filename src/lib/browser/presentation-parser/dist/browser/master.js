import { convertNestedMarkdownToHtml } from '@bldr/markdown-to-html';
import { MediaUri } from '@bldr/client-media-models';
export { convertMarkdownToHtml } from '@bldr/markdown-to-html';
export { convertHtmlToPlainText } from '@bldr/core-browser';
export { buildTextStepController, wrapWords } from '@bldr/dom-manipulator';
export { StepCollector } from './step';
export { extractUrisFromFuzzySpecs, WrappedUriList } from './fuzzy-uri';
export { Resolver } from '@bldr/media-resolver-ng';
export { Slide } from './slide';
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
export function mapStepFieldDefintions(selectors) {
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
export class MasterWrapper {
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
            result.add(MediaUri.removeFragment(uri));
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
                fields[name] = convertNestedMarkdownToHtml(fields[name]);
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
}
