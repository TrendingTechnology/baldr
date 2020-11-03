/**
 * The name of a meta type, for example `person`, `group`.
 */
export type typeName = string;
/**
 * The specification of one metadata type.
 */
export type typeSpec = {
    /**
     * - A title for the metadata type.
     */
    title: string;
    /**
     * - A text to describe a metadata type.
     */
    description: string;
    /**
     * - A two letter abbreviation. Used in
     * the IDs.
     */
    abbreviation: string;
    /**
     * - The base path where all meta typs stored in.
     */
    basePath: string;
    /**
     * - A function which must return the
     * relative path (relative to `basePath`). The function is called with
     * `relPath ({ typeData, typeSpec, oldRelPath })`.
     */
    relPath: Function;
    /**
     * - A regular expression that is
     * matched against file paths or a function which is called with `typeSpec`
     * that returns a regexp.
     */
    detectTypeByPath: (RegExp | Function);
    /**
     * - A function which is called before all
     * processing steps: `initialize ({ typeData, typeSpec })`
     */
    initialize: Function;
    /**
     * - A function which is called after all
     * processing steps: arguments: `finalize ({ typeData, typeSpec })`
     */
    finalize: Function;
    props: any;
};
/**
 * Multiple meta data type names, separated by commas, for example
 * `work,recording`. `work,recording` is equivalent to `general,work,recording`.
 */
export type typeNames = string;
/**
 * Some actual data which can be assigned to a meta type.
 */
export type typeData = any;
/**
 * The name of a property.
 */
export type propName = string;
/**
 * The specification of a property.
 */
export type propSpec = {
    /**
     * - A title of the property.
     */
    title: string;
    /**
     * - A text which describes the property.
     */
    description: string;
    /**
     * - True if the property is required.
     */
    required: boolean;
    /**
     * - A function to derive this property from
     * other values. The function is called with
     * `derive ({ typeData, typeSpec, folderTitles, filePath })`.
     */
    derive: Function;
    /**
     * - Overwrite the original value by the
     * the value obtained from the `derive` function.
     */
    overwriteByDerived: boolean;
    /**
     * - Format the value of the property using this
     * function. The function has this arguments:
     * `format (value, { typeData, typeSpec })`
     */
    format: Function;
    /**
     * - If the value matches the specified
     * regular expression, remove the property.
     */
    removeByRegexp: RegExp;
    /**
     * - Validate the property using this function.
     */
    validate: Function;
    /**
     * - See package
     * `@bldr/wikidata`.
     */
    wikidata: any;
};
/**
 * The specification of all properties. The single `propSpec`s are indexed
 * by the `propName`.
 *
 * ```js
 * const propSpecs = {
 *    propName1: propSpec1,
 *    propName2: propSpec2
 *    ...
 * }
 * ```
 */
export type propSpecs = any;
/**
 * The name of a meta type, for example `person`, `group`.
 *
 * @typedef {String} typeName
 */
/**
 * The specification of one metadata type.
 *
 * @typedef {Object} typeSpec
 *
 * @property {String} title - A title for the metadata type.
 *
 * @property {String} description - A text to describe a metadata type.
 *
 * @property {String} abbreviation - A two letter abbreviation. Used in
 *   the IDs.
 *
 * @property {String} basePath - The base path where all meta typs stored in.
 *
 * @property {Function} relPath - A function which must return the
 *   relative path (relative to `basePath`). The function is called with
 *   `relPath ({ typeData, typeSpec, oldRelPath })`.
 *
 * @property {(RegExp|Function)} detectTypeByPath - A regular expression that is
 *   matched against file paths or a function which is called with `typeSpec`
 *   that returns a regexp.
 *
 * @property {Function} initialize - A function which is called before all
 *   processing steps: `initialize ({ typeData, typeSpec })`
 *
 * @property {Function} finalize - A function which is called after all
 *   processing steps: arguments: `finalize ({ typeData, typeSpec })`
 *
 * @property {module:@bldr/media-server/meta-types~propSpecs} props
 */
/**
 * The specification of all meta types
 *
 * ```js
 * const typeSpecs = {
 *   typeName1: typeSpec1,
 *   typeName2: typeSpec2
 *   ...
 * }
 * ```
 *
 * @typedef {Object} typeSpecs
 */
/**
 * Multiple meta data type names, separated by commas, for example
 * `work,recording`. `work,recording` is equivalent to `general,work,recording`.
 *
 *
 *
 * @typedef {String} typeNames
 */
/**
 * Some actual data which can be assigned to a meta type.
 *
 * @typedef {Object} typeData
 */
/**
 * The name of a property.
 *
 * @typedef {String} propName
 */
/**
 * The specification of a property.
 *
 * @typedef {Object} propSpec
 *
 * @property {String} title - A title of the property.
 *
 * @property {String} description - A text which describes the property.
 *
 * @property {Boolean} required - True if the property is required.
 *
 * @property {Function} derive - A function to derive this property from
 *   other values. The function is called with
 *   `derive ({ typeData, typeSpec, folderTitles, filePath })`.
 *
 * @property {Boolean} overwriteByDerived - Overwrite the original value by the
 *   the value obtained from the `derive` function.
 *
 * @property {Function} format - Format the value of the property using this
 *   function. The function has this arguments:
 *   `format (value, { typeData, typeSpec })`
 *
 * @property {RegExp} removeByRegexp - If the value matches the specified
 *   regular expression, remove the property.
 *
 * @property {Function} validate - Validate the property using this function.
 *
 * @property {module:@bldr/wikidata~propSpec} wikidata - See package
 *   `@bldr/wikidata`.
 */
/**
 * The specification of all properties. The single `propSpec`s are indexed
 * by the `propName`.
 *
 * ```js
 * const propSpecs = {
 *   propName1: propSpec1,
 *   propName2: propSpec2
 *   ...
 * }
 * ```
 *
 * @typedef {Object} propSpecs
 */
/**
 * Check a file path against a regular expression to get the type name.
 *
 * @param {String} filePath
 *
 * @returns {module:@bldr/media-server/meta-types~typeNames} - The type names
 *   for example `person,group,general`
 */
export function detectTypeByPath(filePath: string): any;
/**
 * Generate the file path of the first specifed meta type.
 *
 * @param {Object} data - The mandatory property is “metaTypes” and “extension”.
 *   One can omit the property “extension”, but than you have to specify the
 *   property “mainImage”.
 * @param {String} oldPath - The old file path.
 *
 * @returns {String} - A absolute path
 */
export function formatFilePath(data: any, oldPath: string): string;
/**
 * Bundle three operations: Sort and derive, format, validate.
 *
 * @param {Object} data - An object containing some meta data.
 *
 * @returns {Object}
 */
export function process(data: any): any;
/**
 * @type {module:@bldr/media-server/meta-types~typeSpecs}
 */
export const typeSpecs: any;
/**
 * The specification of all meta types
 *
 * ```js
 * const typeSpecs = {
 *    typeName1: typeSpec1,
 *    typeName2: typeSpec2
 *    ...
 * }
 * ```
 */
export type typeSpecs = any;
