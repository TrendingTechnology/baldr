type Option = [string, string]

/**
 * The specification of a command line (sub)command.
 *
 * For example:
 *
 * ```
 * import { CliCommandSpec } from '@bldr/type-definitions'
 *
 * export = <CliCommandSpec> {
 *   command: 'open-media',
 *   alias: 'o',
 *   checkExecutable: 'xdg-open',
 *   description: 'Open the base directory of the media server in the file manager.'
 * }
 * ```
 */
export interface CliCommandSpec {
  /**
   * For example: `normalize [files...]`
   */
  command: string

  /**
   * For example: `n`
   */
  alias?: string,

  /**
   * For example:
   *
   * ```
   * [
   *   ['-w, --wikidata', 'Call wikidata to enrich the metadata.']
   * ]
   * ```
   */
  options?: Option[]

  /**
   * For example: `Normalize the meta data files in the YAML format
   * (sort, clean up).`
   */
  description: string

  /**
   * Binaries to check for existence.
   */
  checkExecutable?: string | string[]
}
