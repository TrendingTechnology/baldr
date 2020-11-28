"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertYamlStringToObject = exports.convertObjectToYamlString = exports.jsYamlConfig = void 0;
const js_yaml_1 = require("js-yaml");
const object_manipulation_1 = require("./object-manipulation");
/**
 * @link {@see https://www.npmjs.com/package/js-yaml}
 */
exports.jsYamlConfig = {
    noArrayIndent: true,
    lineWidth: 72,
    noCompatMode: true
};
/**
 * Convert a Javascript object into a text string, ready to be written
 * into a text file. The property names are converted to `snake_case`.
 *
 * @param data - Some data to convert to a YAML string.
 *
 * @returns A string in the YAML format ready to be written into a text
 *   file. The result string begins with `---`.
 */
function convertObjectToYamlString(data) {
    data = object_manipulation_1.convertPropertiesCamelToSnake(data);
    const yamlMarkup = [
        '---',
        js_yaml_1.safeDump(data, exports.jsYamlConfig)
    ];
    return yamlMarkup.join('\n');
}
exports.convertObjectToYamlString = convertObjectToYamlString;
/**
 * Load a YAML string and convert into a Javascript object. The string
 * properties are converted in the `camleCase` format. The function
 * returns a object with string properties to save Visual Studio Code
 * type checks (Not AssetType, PresentationTypes etc).
 *
 * @param yamlString - A string in the YAML format..
 *
 * @returns The parsed YAML file as an object. The string properties are
 * converted in the `camleCase` format.
 */
function convertYamlStringToObject(yamlString) {
    const result = js_yaml_1.safeLoad(yamlString);
    if (typeof result !== 'object') {
        return { result };
    }
    return object_manipulation_1.convertPropertiesSnakeToCamel(result);
}
exports.convertYamlStringToObject = convertYamlStringToObject;
