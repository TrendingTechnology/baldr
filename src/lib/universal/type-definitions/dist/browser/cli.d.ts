declare type Option = [string, string];
/**
 * The specification of a command line (sub)command.
 *
 * For example:
 *
 * ```
 * import type { CliCommandSpec } from '@bldr/type-definitions'
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
     * The method
     * [command](https://www.npmjs.com/package/commander#commands) of the
     * commander object is used to generate a new command
     * (`program.command(def.command)`).
     *
     * For example: `normalize [files...]`
     */
    command: string;
    /**
     * For example: `n`
     */
    alias?: string;
    /**
     * For example:
     *
     * ```
     * [
     *   ['-w, --wikidata', 'Call wikidata to enrich the metadata.']
     * ]
     * ```
     */
    options?: Option[];
    /**
     * The method
     * [description](https://www.npmjs.com/package/commander#commands) of the
     * commander object is used to generate a new command
     * (`subProgramm.description(def.description)`).
     *
     * For example: `Normalize the meta data files in the YAML format
     * (sort, clean up).`
     */
    description: string;
    /**
     * Binaries to check for existence.
     */
    checkExecutable?: string | string[];
}
export {};
