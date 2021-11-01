"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Master = void 0;
/**
 * The icon of a master slide. This icon is shown in the documentation or
 * on the left corner of a slide.
 */
class MasterIcon {
    constructor({ name, color, size, showOnSlides }) {
        if (size && !['small', 'large'].includes(size)) {
            throw new Error(`The property “size” of the “MasterIcon” has to be “small” or “large” not ${size}`);
        }
        if (showOnSlides !== undefined && typeof showOnSlides !== 'boolean') {
            throw new Error(`The property “showOnSlide” of the “MasterIcon” has to be “boolean” not ${showOnSlides}`);
        }
        this.name = name;
        this.color = color || 'orange';
        this.showOnSlides = showOnSlides !== false;
        this.size = size || 'small';
    }
}
class Master {
    get icon() {
        return new MasterIcon(this.iconSpec);
    }
    /**
     * The result must correspond to the fields definition.
     *
     * Called during the parsing the YAML file (`Praesentation.baldr.yml`)
     *
     * ```js
     * normalizeFields (fields) {
     *   if (typeof fields === 'string') {
     *     return {
     *       markup: fields
     *     }
     *   }
     * }
     * ```
     */
    normalizeFields(fields) {
        return fields;
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
    /**
     * Retrieve the media URIs which have to be resolved.
     *
     * Call the master funtion `resolveMediaUris` and collect the media URIs.
     * (like [id:beethoven, ref:mozart]). Extract media URIs from
     * the text props.
     *
     * Called during the parsing the YAML file (`Praesentation.baldr.yml`).
     *
     * ```js
     * // An array of media URIs to resolve (like [id:beethoven, ref:mozart.mp3])
     * collectMediaUris (fields) {
     *   return fields.src
     * }
     * ```
     */
    collectMediaUris(fields) {
        return undefined;
    }
    /**
     * Check if the handed over media URIs can be resolved. Throw no errors, if
     * the media assets are not present. This hook is used in the YouTube master
     * slide. This master slide uses the online version, if no offline video could
     * be resolved.
     */
    collectOptionalMediaUris(fields) {
        return undefined;
    }
    processMediaUris(fields) {
        return Master.convertToSet(this.collectMediaUris(fields));
    }
    processOptionalMediaUris(fields) {
        return Master.convertToSet(this.collectOptionalMediaUris(fields));
    }
}
exports.Master = Master;
