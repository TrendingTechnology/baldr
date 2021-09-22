"use strict";
/**
 * Code to manage and process the metadata categories of the media server.
 *
 * A media asset can be attached to multiple metadata categories (for example:
 * `categories: recording,composition`). All metadata categories belong to the
 * type `general`. The media category `general` is applied at the end.
 *
 * @module @bldr/media-categories
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.process = exports.searchUnknownProps = exports.mergeNames = exports.formatFilePath = exports.detectCategoryByPath = void 0;
// Node packages.
const path_1 = __importDefault(require("path"));
// Project packages.
const core_browser_1 = require("@bldr/core-browser");
const yaml_1 = require("@bldr/yaml");
const config_1 = __importDefault(require("@bldr/config"));
const titles_1 = require("@bldr/titles");
const specs_1 = require("./specs");
const two_letter_abbreviations_1 = require("./two-letter-abbreviations");
two_letter_abbreviations_1.checkTypeAbbreviations(specs_1.categories);
/**
 * Check a file path against a regular expression to get the category name.
 *
 * @returns The category names for example `person,group,general`
 */
function detectCategoryByPath(filePath) {
    filePath = path_1.default.resolve(filePath);
    const names = new Set();
    for (const name in specs_1.categories) {
        const category = specs_1.categories[name];
        if (category.detectCategoryByPath != null) {
            let regexp;
            if (typeof category.detectCategoryByPath === 'function') {
                regexp = category.detectCategoryByPath(category);
            }
            else {
                regexp = category.detectCategoryByPath;
            }
            if (filePath.match(regexp) != null)
                names.add(name);
        }
    }
    names.add('general');
    if (names.size > 0)
        return [...names].join(',');
}
exports.detectCategoryByPath = detectCategoryByPath;
/**
 * Generate the file path of the first specifed media category.
 *
 * @param data - The mandatory property is “categories” and “extension”.
 *   One can omit the property “extension”, but than you have to specify
 *   the property “mainImage”.
 * @param oldPath - The old file path.
 *
 * @returns A absolute path
 */
function formatFilePath(data, oldPath) {
    if (data.categories == null) {
        throw new Error('Your data needs a property named “categories”.');
    }
    // TODO: support multiple types
    // person,general -> person
    const categoryName = data.categories.replace(/,.*$/, '');
    const category = specs_1.categories[categoryName];
    if (category == null) {
        throw new Error(`Unkown media category “${categoryName}”.`);
    }
    if (category.relPath == null || typeof category.relPath !== 'function') {
        return;
    }
    // The relPath function needs this.extension.
    if (data.extension == null) {
        if (data.mainImage == null) {
            throw new Error('Your data needs a property named “mainImage”.');
        }
        const extension = core_browser_1.getExtension(data.mainImage);
        if (extension == null) {
            throw new Error('Extension couldn’t be detected.');
        }
        data.extension = extension;
        // b/Bush_George-Walker/main.jpeg
    }
    if (data.extension === 'jpeg')
        data.extension = 'jpg';
    let oldRelPath = '';
    if (oldPath != null) {
        oldRelPath = path_1.default.resolve(oldPath);
        oldRelPath = oldRelPath.replace(config_1.default.mediaServer.basePath, '');
        oldRelPath = oldRelPath.replace(/^\//, '');
    }
    // b/Bush_George-Walker/main.jpeg
    const relPath = category.relPath({ data, category, oldRelPath });
    if (relPath == null) {
        throw new Error(`The relPath() function has to return a string for media category “${categoryName}”`);
    }
    const basePath = category.basePath != null ? category.basePath : config_1.default.mediaServer.basePath;
    return path_1.default.join(basePath, relPath);
}
exports.formatFilePath = formatFilePath;
/**
 * Check if the given argument has a value and is no empty string.
 */
function isValue(value) {
    if (value == null) {
        return false;
    }
    if (value === '') {
        return false;
    }
    return true;
}
/**
 * Apply the media category specifications to all props.
 *
 * @param data - An object containing some meta data.
 * @param func - A function with the arguments `spec` (property
 *   specification), `value`, `propName`
 * @param category - The specification of one media category.
 * @param replaceValues - Replace the values in the metadata object.
 */
function applySpecToProps(data, func, category, replaceValues = true) {
    function applyOneTypeSpec(props, propName, data, func, replaceValues) {
        const propSpec = props[propName];
        const value = func(propSpec, data[propName], propName);
        if (replaceValues && isValue(value)) {
            data[propName] = value;
        }
    }
    const propSpecs = category.props;
    for (const propName in propSpecs) {
        applyOneTypeSpec(propSpecs, propName, data, func, replaceValues);
    }
    return data;
}
/**
 * @param propSpec - The
 *   specification of one property
 */
function isPropertyDerived(propSpec) {
    if (typeof propSpec.derive === 'function') {
        return true;
    }
    return false;
}
/**
 * Sort the given object according the type specification. Not specifed
 * propertiers are attached on the end of the object. Fill the object
 * with derived values.
 *
 * @param data - An object containing some meta data.
 * @param category - The specification of one media category.
 * @param filePath - The path of media asset itself, not the metadata
 *   `*.extension.yml` file.
 */
function sortAndDeriveProps(data, category, filePath) {
    // eslint-disable-next-line
    const origData = core_browser_1.deepCopy(data);
    // eslint-disable-next-line
    const result = {};
    // eslint-disable-next-line
    let folderTitles = {};
    if (filePath != null) {
        folderTitles = new titles_1.DeepTitle(filePath);
    }
    // Loop over the propSpecs to get a sorted object
    const propSpecs = category.props;
    for (const propName in propSpecs) {
        const propSpec = propSpecs[propName];
        const origValue = origData[propName];
        let derivedValue;
        if (isPropertyDerived(propSpec) && propSpec.derive != null) {
            derivedValue = propSpec.derive({ data, category, folderTitles, filePath });
        }
        // Use the derived value
        const overwriteByDerived = propSpec.overwriteByDerived != null ? propSpec.overwriteByDerived : false;
        if (isValue(derivedValue) &&
            ((!overwriteByDerived && !isValue(origValue)) || overwriteByDerived)) {
            result[propName] = derivedValue;
            // Use orig value
        }
        else if (isValue(origValue)) {
            result[propName] = origValue;
        }
        // Throw away the value of this property. We prefer the derived
        // version.
        // eslint-disable-next-line
        delete origData[propName];
    }
    // Add additional properties not in the propSpecs.
    for (const propName in origData) {
        const value = origData[propName];
        if (isValue(value)) {
            result[propName] = value;
        }
    }
    return result;
}
/**
 * @param data - An object containing some meta data.
 * @param category - The category name.
 */
function formatProps(data, category, filePath) {
    function formatOneProp(spec, value) {
        if (isValue(value) &&
            spec.format != null &&
            typeof spec.format === 'function') {
            return spec.format(value, { data, category, filePath });
        }
        return value;
    }
    return applySpecToProps(data, formatOneProp, category);
}
/**
 * @param data - An object containing some meta data.
 * @param category - The specification of one media category.
 */
function validateProps(data, category) {
    function validateOneProp(spec, value, prop) {
        // required
        if (spec.required != null && !isValue(value)) {
            throw new Error(`Missing property ${prop}`);
        }
        // validate
        if (spec.validate != null &&
            typeof spec.validate === 'function' &&
            isValue(value)) {
            const result = spec.validate(value);
            if (!result) {
                /* eslint-disable @typescript-eslint/restrict-template-expressions */
                throw new Error(`Validation failed for property “${prop}” and value “${value}”`);
            }
        }
    }
    applySpecToProps(data, validateOneProp, category, false);
}
/**
 * Delete properties from the data.
 *
 * @param data - An object containing some meta data.
 * @param category - The specification of one media category.
 */
function removeProps(data, category) {
    for (const propName in category.props) {
        if (data[propName] != null) {
            const value = data[propName];
            const propSpec = category.props[propName];
            if (
            // eslint-disable-next-line
            !isValue(value) ||
                // eslint-disable-next-line
                (propSpec.state && propSpec.state === 'absent') ||
                (propSpec.removeByRegexp != null &&
                    propSpec.removeByRegexp instanceof RegExp &&
                    typeof value === 'string' &&
                    value.match(propSpec.removeByRegexp) != null)) {
                // eslint-disable-next-line
                delete data[propName];
            }
        }
    }
    return data;
}
/**
 * Bundle three operations: Sort and derive, format, validate.
 *
 * @param data - An object containing some meta data.
 * @param name - The name of the media category, for example “general” or “cloze”.
 * @param filePath - The path of media asset itself, not the metadata
 *   `*.extension.yml` file.
 */
function processByType(data, name, filePath) {
    if (specs_1.categories[name] == null) {
        throw new Error(`Unkown meta category name: “${name}”`);
    }
    const category = specs_1.categories[name];
    if (category.initialize != null &&
        typeof category.initialize === 'function') {
        data = category.initialize({ data, category, filePath });
    }
    data = sortAndDeriveProps(data, category, filePath);
    data = formatProps(data, category, filePath);
    // We need filePath in format. Must be after formatProps
    data = removeProps(data, category);
    validateProps(data, category);
    if (category.finalize != null && typeof category.finalize === 'function') {
        data = category.finalize({ data, category, filePath });
    }
    return data;
}
/**
 * Merge category names to avoid duplicate metadata category names:
 */
function mergeNames(...name) {
    const categories = new Set();
    for (let i = 0; i < arguments.length; i++) {
        const categoryNames = arguments[i];
        if (typeof categoryNames === 'string' && categoryNames !== '') {
            for (const name of categoryNames.split(',')) {
                categories.add(name);
            }
        }
    }
    return [...categories].join(',');
}
exports.mergeNames = mergeNames;
/**
 * Add `general` to the categories name string.
 *
 * @param categoriesNames - A comma separated string of categories names.
 *
 * @returns A normalized categories names string.
 */
function generalizeCategoriesNames(categoriesNames) {
    if (categoriesNames == null) {
        categoriesNames = 'general';
    }
    else if (!categoriesNames.includes('general')) {
        categoriesNames = `${categoriesNames},general`;
    }
    return mergeNames(...categoriesNames.split(','));
}
/**
 * @returns An array of unknown props.
 */
function searchUnknownProps(data) {
    data = core_browser_1.deepCopy(data);
    data = yaml_1.convertPropertiesSnakeToCamel(data);
    data.categories = generalizeCategoriesNames(data.categories);
    for (const categoryName of data.categories.split(',')) {
        const category = specs_1.categories[categoryName];
        for (const propName in category.props) {
            if (data[propName] != null) {
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete data[propName];
            }
        }
    }
    return Object.keys(data);
}
exports.searchUnknownProps = searchUnknownProps;
/**
 * Bundle three operations: Sort and derive, format, validate.
 *
 * @param data - An object containing some meta data.
 * @param filePath - The path of media asset itself, not the metadata
 *   `*.extension.yml` file.
 */
function process(data, filePath) {
    if (filePath != null) {
        filePath = path_1.default.resolve(filePath);
    }
    // The media category specification is in camel case. The meta data is
    // stored in the YAML format in snake case
    data = yaml_1.convertPropertiesSnakeToCamel(data);
    data.categories = generalizeCategoriesNames(data.categories);
    for (const name of data.categories.split(',')) {
        data = processByType(data, name, filePath);
    }
    const unknownProps = searchUnknownProps(data);
    if (unknownProps.length > 0) {
        throw new Error(`unknown properties: ${unknownProps.join(', ')}`);
    }
    // Do not convert back. This conversion should be the last step, before
    // object is converted to YAML.
    // convertProperties(data, 'camel-to-snake')
    return data;
}
exports.process = process;
