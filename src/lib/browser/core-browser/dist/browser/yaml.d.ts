/**
 * @link {@see https://www.npmjs.com/package/js-yaml}
 */
export declare const jsYamlConfig: {
    noArrayIndent: boolean;
    lineWidth: number;
    noCompatMode: boolean;
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
export declare function convertObjectToYamlString(data: any): string;
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
export declare function convertYamlStringToObject(yamlString: string): {
    [key: string]: any;
};
