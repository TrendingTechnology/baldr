"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertFromYaml = exports.convertToYaml = void 0;
const js_yaml_1 = require("js-yaml");
const object_manipulation_1 = require("./object-manipulation");
/**
 * @link {@see https://www.npmjs.com/package/js-yaml}
 */
const jsYamlConfig = {
    noArrayIndent: true,
    lineWidth: 72,
    noCompatMode: true
};
/**
 * Convert a Javascript object into a text string. The returned string of the
 * function is ready to be written into a text file. The property names are
 * converted to `snake_case`.
 *
 * @param data - Some data to convert to a YAML string.
 *
 * @returns A string in the YAML format ready to be written into a text file.
 *   The result string begins with `---`.
 */
function convertToYaml(data) {
    data = object_manipulation_1.convertPropertiesCamelToSnake(data);
    const yamlMarkup = [
        '---',
        js_yaml_1.dump(data, jsYamlConfig)
    ];
    return yamlMarkup.join('\n');
}
exports.convertToYaml = convertToYaml;
/**
 * Load a YAML string and convert into a Javascript object. The string
 * properties are converted in the `camleCase` format. The function returns an
 * object with string properties to save Visual Studio Code type checks (Not
 * AssetType, PresentationTypes etc).
 *
 * @param yamlString - A string in the YAML format..
 *
 * @returns The parsed YAML file as an object. The string properties are
 *   converted in the `camleCase` format.
 */
function convertFromYaml(yamlString) {
    const result = js_yaml_1.load(yamlString);
    if (typeof result !== 'object') {
        return { result };
    }
    return object_manipulation_1.convertPropertiesSnakeToCamel(result);
}
exports.convertFromYaml = convertFromYaml;
