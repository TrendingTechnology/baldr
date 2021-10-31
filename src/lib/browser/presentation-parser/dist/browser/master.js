export class Master {
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
        return;
    }
    /**
     * Check if the handed over media URIs can be resolved. Throw no errors, if
     * the media assets are not present. This hook is used in the YouTube master
     * slide. This master slide uses the online version, if no offline video could
     * be resolved.
     */
    collectOptionalMediaUris(fields) {
        return;
    }
    processMediaUris(fields) {
        return Master.convertToSet(this.collectMediaUris(fields));
    }
    processOptionalMediaUris(fields) {
        return Master.convertToSet(this.collectOptionalMediaUris(fields));
    }
}
