/**
 * Load a YAML file and convert it into a Javascript object. The string
 * properties are converted into the `camleCase` format.
 *
 * @param filePath - The path of a YAML file itself.
 *
 * @returns The parsed YAML file as an object. The string properties are
 * converted into the `camleCase` format.
 */
export declare function readYamlFile(filePath: string): Record<string, any>;
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
export declare function writeYamlFile(filePath: string, data: object): string;
