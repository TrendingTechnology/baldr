"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertFromYaml = exports.convertFromYamlRaw = exports.convertToYaml = exports.convertToYamlRaw = void 0;
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
 * A wrapper around `yaml.dump(data)`.
 *
 * @param data - Some data to convert to a YAML string.
 *
 * @returns A string in the YAML format (without `---` at the beginning).
 */
function convertToYamlRaw(data) {
    return (0, js_yaml_1.dump)(data, jsYamlConfig);
}
exports.convertToYamlRaw = convertToYamlRaw;
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
    data = (0, object_manipulation_1.convertPropertiesCamelToSnake)(data);
    const yamlMarkup = ['---', convertToYamlRaw(data)];
    return yamlMarkup.join('\n');
}
exports.convertToYaml = convertToYaml;
/**
 * A wrapper around `yaml.load(string)`.
 *
 * @param yamlString - A string in the YAML format.
 *
 * @returns Wraps strings and numbers into an object.
 */
function convertFromYamlRaw(yamlString) {
    const result = (0, js_yaml_1.load)(yamlString);
    if (result == null) {
        return;
    }
    if (typeof result === 'object') {
        return result;
    }
}
exports.convertFromYamlRaw = convertFromYamlRaw;
/**
 * Load a YAML string and convert into a Javascript object. The string
 * properties are converted in the `camleCase` format. The function returns an
 * object with string properties to save Visual Studio Code type checks (Not
 * MediaResolverTypes etc).
 *
 * @param yamlString - A string in the YAML format.
 *
 * @returns The parsed YAML file as an object. The string properties are
 *   converted in the `camleCase` format.
 */
function convertFromYaml(yamlString) {
    const result = convertFromYamlRaw(yamlString);
    return (0, object_manipulation_1.convertPropertiesSnakeToCamel)(result);
}
exports.convertFromYaml = convertFromYaml;
