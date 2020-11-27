import { Presentation } from './presentation'

/**
 * Parse the YAML file `Praesentation.baldr.yml`.
 *
 * @property rawYamlString - The raw YAML string of the YAML file
 *   `Praesentation.baldr.yml`
 */
export function parse (rawYamlString: string): Presentation {
  return new Presentation(rawYamlString);
}
