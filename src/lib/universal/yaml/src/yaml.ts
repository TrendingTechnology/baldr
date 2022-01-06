import { dump, load } from 'js-yaml'

import {
  convertPropertiesCamelToSnake,
  convertPropertiesSnakeToCamel
} from './object-manipulation'

/**
 * @link {@see https://www.npmjs.com/package/js-yaml}
 */
const jsYamlConfig = {
  noArrayIndent: true,
  lineWidth: 72,
  noCompatMode: true
}

/**
 * A wrapper around `yaml.dump(data)`.
 *
 * @param data - Some data to convert to a YAML string.
 *
 * @returns A string in the YAML format (without `---` at the beginning).
 */
export function convertToYamlRaw (data: any): string {
  return dump(data, jsYamlConfig)
}

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
export function convertToYaml (data: any): string {
  data = convertPropertiesCamelToSnake(data)
  const yamlMarkup = ['---', convertToYamlRaw(data)]
  return yamlMarkup.join('\n')
}

/**
 * A wrapper around `yaml.load(string)`.
 *
 * @param yamlString - A string in the YAML format.
 *
 * @returns Wraps strings and numbers into an object.
 */
export function convertFromYamlRaw (yamlString: string): object | null | undefined {
  const result = load(yamlString)
  if (result == null) {
    return
  }
  if (typeof result === 'object') {
    return result
  }
}

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
export function convertFromYaml (yamlString: string): { [key: string]: any } {
  const result = convertFromYamlRaw(yamlString)
  return convertPropertiesSnakeToCamel(result)
}
