/**
 * Code to manage and process the meta data types of the media server.
 *
 * A media asset can be attached to multiple meta data types (for example:
 * `meta_types: recording,composition`). All meta data types belong to the type
 * `general`. The meta type `general` is applied at the end.
 *
 * The meta data types are specified in the module
 * {@link module:@bldr/media-server/meta-type-specs meta-type-specs}
 *
 * @module @bldr/media-server/meta-types
 */
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
// Node packages.
var path = require('path');
// Project packages.
var _a = require('@bldr/core-browser'), deepCopy = _a.deepCopy, getExtension = _a.getExtension, convertPropertiesSnakeToCamel = _a.convertPropertiesSnakeToCamel;
var config = require('@bldr/config');
/**
 * @type {module:@bldr/media-server/meta-types~typeSpecs}
 */
var typeSpecs = require('./meta-type-specs.js');
var HierarchicalFolderTitles = require('./titles.js').HierarchicalFolderTitles;
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
function detectTypeByPath(filePath) {
    filePath = path.resolve(filePath);
    var typeNames = new Set();
    for (var typeName in typeSpecs) {
        var typeSpec = typeSpecs[typeName];
        if (typeSpec.detectTypeByPath) {
            var regexp = void 0;
            if (typeof typeSpec.detectTypeByPath === 'function') {
                regexp = typeSpec.detectTypeByPath(typeSpec);
            }
            else {
                regexp = typeSpec.detectTypeByPath;
            }
            if (filePath.match(regexp))
                typeNames.add(typeName);
        }
    }
    typeNames.add('general');
    if (typeNames.size)
        return __spreadArrays(typeNames).join(',');
}
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
function formatFilePath(data, oldPath) {
    if (!data.metaTypes)
        throw new Error("Your data needs a property named \u201CmetaTypes\u201D.");
    // TODO: support multiple types
    // person,general -> person
    var typeName = data.metaTypes.replace(/,.*$/, '');
    var typeSpec = typeSpecs[typeName];
    if (!typeSpec)
        throw new Error("Unkown meta type \u201C" + typeName + "\u201D.");
    if (!typeSpec.relPath || typeof typeSpec.relPath !== 'function') {
        return;
    }
    // The relPath function needs this.extension.
    if (!data.extension) {
        if (!data.mainImage)
            throw new Error("Your data needs a property named \u201CmainImage\u201D.");
        data.extension = getExtension(data.mainImage);
        // b/Bush_George-Walker/main.jpeg
    }
    if (data.extension === 'jpeg')
        data.extension = 'jpg';
    var oldRelPath;
    if (oldPath) {
        oldRelPath = path.resolve(oldPath);
        oldRelPath = oldRelPath.replace(config.mediaServer.basePath, '');
        oldRelPath = oldRelPath.replace(/^\//, '');
    }
    // b/Bush_George-Walker/main.jpeg
    var relPath = typeSpec.relPath({ typeData: data, typeSpec: typeSpec, oldRelPath: oldRelPath });
    if (!relPath)
        throw new Error("The relPath() function has to return a string for meta type \u201C" + typeName + "\u201D");
    // To avoid confusion with class MediaFile in the module @bldr/media-client
    delete data.extension;
    var basePath = typeSpec.basePath ? typeSpec.basePath : config.mediaServer.basePath;
    return path.join(basePath, relPath);
}
/**
 * @param {(String|Boolean|Number)} value
 *
 * @returns {Boolean}
 */
function isValue(value) {
    if (value || typeof value === 'boolean') {
        return true;
    }
    return false;
}
/**
 * Apply the meta type specifications to all props
 *
 * @param {Object} data - An object containing some meta data.
 * @param {Function} func - A function with the arguments `spec`
 *   (property specification), `value`, `propName`
 * @param {module:@bldr/media-server/meta-types~typeSpec} typeSpec - The specification
 *   of one meta type.
 * @param {Boolean} replaceValues - Replace the values in the metadata object.
 */
function applySpecToProps(data, func, typeSpec, replaceValues) {
    if (replaceValues === void 0) { replaceValues = true; }
    function applyOneTypeSpec(props, propName, data, func, replaceValues) {
        var propSpec = props[propName];
        var value = func(propSpec, data[propName], propName);
        if (replaceValues && isValue(value)) {
            data[propName] = value;
        }
    }
    var propSpecs = typeSpec.props;
    for (var propName in propSpecs) {
        applyOneTypeSpec(propSpecs, propName, data, func, replaceValues);
    }
    return data;
}
/**
 * @param {module:@bldr/media-server/meta-types~propSpec} propSpec - The
 *   specification of one property
 */
function isPropertyDerived(propSpec) {
    if (propSpec && propSpec.derive && typeof propSpec.derive === 'function') {
        return true;
    }
    return false;
}
/**
 * Sort the given object according the type specification. Not specifed
 * propertiers are attached on the end of the object. Fill the object
 * with derived values.
 *
 * @param {Object} data - An object containing some meta data.
 * @param {module:@bldr/media-server/meta-types~typeSpec} typeSpec - The specification
 *   of one meta type.
 *
 * @returns {Object}
 */
function sortAndDeriveProps(data, typeSpec) {
    var origData = deepCopy(data);
    var result = {};
    var folderTitles;
    var filePath;
    if (data.filePath) {
        filePath = data.filePath;
        folderTitles = new HierarchicalFolderTitles(data.filePath);
    }
    // Loop over the propSpecs to get a sorted object
    var propSpecs = typeSpec.props;
    for (var propName in propSpecs) {
        var propSpec = propSpecs[propName];
        var origValue = origData[propName];
        var derivedValue = void 0;
        if (isPropertyDerived(propSpec)) {
            derivedValue = propSpec.derive({ typeData: data, typeSpec: typeSpec, folderTitles: folderTitles, filePath: filePath });
        }
        // Use the derived value
        if (isValue(derivedValue) &&
            ((!propSpec.overwriteByDerived && !isValue(origValue)) ||
                propSpec.overwriteByDerived)) {
            result[propName] = derivedValue;
            // Use orig value
        }
        else if (isValue(origValue)) {
            result[propName] = origValue;
        }
        // Throw away the value of this property. We prefer the derived
        // version.
        delete origData[propName];
    }
    // Add additional properties not in the propSpecs.
    for (var propName in origData) {
        var value = origData[propName];
        if (isValue(value)) {
            result[propName] = value;
        }
    }
    return result;
}
/**
 * @param {Object} data - An object containing some meta data.
 * @param {module:@bldr/media-server/meta-types~typeName} typeSpec - The type name
 */
function formatProps(data, typeSpec) {
    function formatOneProp(spec, value) {
        if (isValue(value) &&
            spec.format &&
            typeof spec.format === 'function') {
            return spec.format(value, { typeData: data, typeSpec: typeSpec });
        }
        return value;
    }
    return applySpecToProps(data, formatOneProp, typeSpec);
}
/**
 * @param {Object} data - An object containing some meta data.
 * @param {module:@bldr/media-server/meta-types~typeSpec} typeSpec - The specification
 *   of one meta type.
 */
function validateProps(data, typeSpec) {
    function validateOneProp(spec, value, prop) {
        // required
        if (spec.required && !isValue(value)) {
            throw new Error("Missing property " + prop);
        }
        // validate
        if (spec.validate && typeof spec.validate === 'function' && isValue(value)) {
            var result = spec.validate(value);
            if (!result) {
                throw new Error("Validation failed for property \u201C" + prop + "\u201D and value \u201C" + value + "\u201D");
            }
        }
    }
    applySpecToProps(data, validateOneProp, typeSpec, false);
}
/**
 * Delete properties from the data.
 *
 * @param {Object} data - An object containing some meta data.
 * @param {module:@bldr/media-server/meta-types~typeSpec} typeSpec - The specification
 *   of one meta type.
 */
function removeProps(data, typeSpec) {
    for (var propName in typeSpec.props) {
        if (data[propName]) {
            var value = data[propName];
            var propSpec = typeSpec.props[propName];
            if (!isValue(value) ||
                (propSpec.state && propSpec.state === 'absent') ||
                (propSpec.removeByRegexp &&
                    propSpec.removeByRegexp instanceof RegExp &&
                    typeof value === 'string' &&
                    value.match(propSpec.removeByRegexp))) {
                delete data[propName];
            }
        }
    }
    return data;
}
/**
 * Bundle three operations: Sort and derive, format, validate.
 *
 * @param {Object} data - An object containing some meta data.
 * @param {module:@bldr/media-server/meta-types~typeName} typeName - The type name

 * @returns {Object}
 */
function processByType(data, typeName) {
    if (!typeSpecs[typeName]) {
        throw new Error("Unkown meta type name: \u201C" + typeName + "\u201D");
    }
    var typeSpec = typeSpecs[typeName];
    if (!typeSpec.props) {
        throw new Error("The meta type \u201C" + typeName + "\u201D has no props.");
    }
    if (typeSpec.initialize && typeof typeSpec.initialize === 'function') {
        data = typeSpec.initialize({ typeData: data, typeSpec: typeSpec });
    }
    data = sortAndDeriveProps(data, typeSpec);
    data = formatProps(data, typeSpec);
    // We need filePath in format. Must be after formatProps
    data = removeProps(data, typeSpec);
    validateProps(data, typeSpec);
    if (typeSpec.finalize && typeof typeSpec.finalize === 'function') {
        data = typeSpec.finalize({ typeData: data, typeSpec: typeSpec });
    }
    return data;
}
/**
 * Bundle three operations: Sort and derive, format, validate.
 *
 * @param {Object} data - An object containing some meta data.
 *
 * @returns {Object}
 */
function process(data) {
    // The meta type specification is in camel case. The meta data is
    // stored in the YAML format in snake case
    data = convertPropertiesSnakeToCamel(data);
    if (!data.metaTypes) {
        data.metaTypes = 'general';
    }
    else if (data.metaTypes.indexOf('general') === -1) {
        data.metaTypes = data.metaTypes + ",general";
    }
    if (data.metaTypes) {
        for (var _i = 0, _a = data.metaTypes.split(','); _i < _a.length; _i++) {
            var typeName = _a[_i];
            data = processByType(data, typeName);
        }
    }
    // Do not convert back. This conversion should be the last step, before
    // object is converted to YAML.
    // convertPropertiesCamelToSnakedata, 'camel-to-snake')
    return data;
}
module.exports = {
    detectTypeByPath: detectTypeByPath,
    formatFilePath: formatFilePath,
    process: process,
    typeSpecs: typeSpecs
};
