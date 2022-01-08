import { convertToYaml, convertFromYaml } from '@bldr/yaml';
import { readFile, writeFile } from './txt';
/**
 * Load a YAML file and convert it into a Javascript object. The string
 * properties are converted into the `camleCase` format.
 *
 * @param filePath - The path of a YAML file itself.
 *
 * @returns The parsed YAML file as an object. The string properties are
 * converted into the `camleCase` format.
 */
export function readYamlFile(filePath) {
    return convertFromYaml(readFile(filePath));
}
/**
 * Convert some data (usually Javascript objets) into the YAML format
 * and write the string into a text file. The property names are
 * converted to `snake_case`.
 *
 * @param filePath - The file path of the destination yaml file. The yml
 *   extension has to be included.
 * @param data - Some data to convert into yaml and write into a text
 *   file.
 *
 * @returns The data converted to YAML as a string.
 */
export function writeYamlFile(filePath, data) {
    const yaml = convertToYaml(data);
    writeFile(filePath, yaml);
    return yaml;
}
