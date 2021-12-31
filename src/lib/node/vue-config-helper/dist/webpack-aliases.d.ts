/**
 * Search for packages that can be used as aliases in the webpack configuration.
 *
 * @param dirname - Directory path of a package. The package must have
 *   a `node_modules` subfolder.
 */
export declare function searchForAliases(dirname: string): Record<string, string>;
