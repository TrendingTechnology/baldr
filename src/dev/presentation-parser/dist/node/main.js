"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const presentation_1 = require("./presentation");
/**
 * Parse the YAML file `Praesentation.baldr.yml`.
 *
 * @property rawYamlString - The raw YAML string of the YAML file
 *   `Praesentation.baldr.yml`
 */
function parse(rawYamlString) {
    return new presentation_1.Presentation(rawYamlString);
}
exports.parse = parse;
