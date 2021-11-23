export class Master {
    /**
     * The result must correspond to the fields definition.
     *
     * Called during the parsing the YAML file (`Praesentation.baldr.yml`)
     *
     * ```js
     * normalizeFields (props) {
     *   if (typeof props === 'string') {
     *     return {
     *       markup: props
     *     }
     *   }
     * }
     * ```
     */
    normalizeFields(fields) {
        return fields;
    }
}
