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
    /**
     * Before resolving
     */
    initializeFields(fields) {
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
            //  Convert the field marked as containing markup from markdown to HTML.
            if (def.markup != null && def.markup && fields[name] != null) {
                fields[name] = convertMarkdownToHtml(fields[name]);
            }
        }
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
