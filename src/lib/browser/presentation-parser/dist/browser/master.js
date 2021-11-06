import { convertMarkdownToHtml } from '@bldr/markdown-to-html';
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
export class MasterWrapper {
    constructor(MasterClass) {
        this.master = new MasterClass();
        this.icon = new MasterIcon(this.master.icon);
    }
    get name() {
        return this.master.name;
    }
    static convertToSet(uris) {
        if (uris == null) {
            return new Set();
        }
        if (typeof uris === 'string') {
            return new Set([uris]);
        }
        else if (Array.isArray(uris)) {
            return new Set(uris);
        }
        return uris;
    }
    processMediaUris(fields) {
        if (this.master.collectMediaUris != null && fields != null) {
            return MasterWrapper.convertToSet(this.master.collectMediaUris(fields));
        }
        return new Set();
    }
    processOptionalMediaUris(fields) {
        if (this.master.collectOptionalMediaUris != null && fields != null) {
            return MasterWrapper.convertToSet(this.master.collectOptionalMediaUris(fields));
        }
        return new Set();
    }
    generateTexMarkup(fields) {
        if (this.master.generateTexMarkup != null) {
            return this.master.generateTexMarkup(fields);
        }
    }
    normalizeFields(fields) {
        if (this.master.normalizeFields != null) {
            return this.master.normalizeFields(fields);
        }
        return fields;
    }
    /**
     * Raise an error if there is an unknown field.
     */
    detectUnkownFields(fields) {
        for (const fieldName in fields) {
            if (this.master.fieldsDefintion[fieldName] == null) {
                throw new Error(`The master slide “${this.master.name}” has no property named “${fieldName}”.`);
            }
        }
    }
    /**
     * Convert the fields marked as containing markup from markdown to HTML.
     */
    convertFieldsToHtml(fields) {
        for (const fieldName in fields) {
            const fieldDefinition = this.master.fieldsDefintion[fieldName];
            if (fieldDefinition.markup != null && fieldDefinition.markup) {
                fields[fieldName] = convertMarkdownToHtml(fields[fieldName]);
            }
        }
        return fields;
    }
    /**
     * Before resolving
     */
    initializeFields(fields) {
        fields = this.normalizeFields(fields);
        this.detectUnkownFields(fields);
        fields = this.convertFieldsToHtml(fields);
        return fields;
    }
    /**
     * After resolving
     */
    finalizeFields(slide, resolver) {
        if (this.master.collectFields != null) {
            const fields = this.master.collectFields(slide.fields, resolver);
            slide.fields = fields;
            return fields;
        }
    }
}
