"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Master = void 0;
class Master {
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
exports.Master = Master;
