/**
 * A wrapper around `yaml.dump(data)`.
 *
 * @param data - Some data to convert to a YAML string.
 *
 * @returns A string in the YAML format (without `---` at the beginning).
 */
export declare function convertToYamlRaw(data: any): string;
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
export declare function convertToYaml(data: any): string;
/**
 * A wrapper around `yaml.load(string)`.
 *
 * @param yamlString - A string in the YAML format.
 *
 * @returns Wraps strings and numbers into an object.
 */
export declare function convertFromYamlRaw(yamlString: string): object | null | undefined;
/**
 * Load a YAML string and convert into a Javascript object. The string
 * properties are converted in the `camleCase` format. The function returns an
 * object with string properties to save Visual Studio Code type checks (Not
 * MediaDataTypes etc).
 *
 * @param yamlString - A string in the YAML format.
 *
 * @returns The parsed YAML file as an object. The string properties are
 *   converted in the `camleCase` format.
 */
export declare function convertFromYaml(yamlString: string): {
    [key: string]: any;
};
