"use strict";
/**
 * Manipulate javascript objects.
 *
 * @module @bldr/core-browser/object-manipulation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RawDataObject = exports.convertPropertiesCamelToSnake = exports.convertPropertiesSnakeToCamel = exports.convertProperties = exports.deepCopy = exports.convertToString = void 0;
const string_format_1 = require("./string-format");
/**
 * Convert various data to a string. Meant for error messages. Objects
 * are converted to a string using `JSON.stringify`
 *
 * @param data - Various data in various types.
 */
function convertToString(data) {
    if (data === null) {
        return 'null';
    }
    else if (data != null) {
        return typeof data;
    }
    else if (typeof data === 'string') {
        return data;
    }
    else if (Array.isArray(data)) {
        return data.toString();
    }
    else {
        return JSON.stringify(data);
    }
}
exports.convertToString = convertToString;
/**
 * Create a deep copy of an object. This functions uses the two methods
 * `JSON.parse()` and `JSON.stringify()` to accomplish its task.
 *
 * @param data
 */
function deepCopy(data) {
    return JSON.parse(JSON.stringify(data));
}
exports.deepCopy = deepCopy;
var PropertyConvertDirection;
(function (PropertyConvertDirection) {
    PropertyConvertDirection[PropertyConvertDirection["SNAKE_TO_CAMEL"] = 0] = "SNAKE_TO_CAMEL";
    PropertyConvertDirection[PropertyConvertDirection["CAMEL_TO_SNAKE"] = 1] = "CAMEL_TO_SNAKE";
})(PropertyConvertDirection || (PropertyConvertDirection = {}));
/**
 * Convert all properties in an object from `snake_case` to `camelCase` or vice
 * versa in a recursive fashion.
 *
 * @param data - Some data in various formats.
 * @param direction - `snake-to-camel` or `camel-to-snake`
 *
 * @returns Possibly an new object is returned. One should always
 *   use this returned object.
 */
function convertProperties(data, direction = PropertyConvertDirection.SNAKE_TO_CAMEL) {
    // To perserve the order of the props.
    let newObject = null;
    // Array
    if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            if (typeof item === 'object') {
                data[i] = convertProperties(item, direction);
            }
        }
        // Object
    }
    else if (typeof data === 'object') {
        newObject = {};
        for (const oldProp in data) {
            let newProp;
            if (direction === PropertyConvertDirection.CAMEL_TO_SNAKE) {
                newProp = string_format_1.convertCamelToSnake(oldProp);
            }
            else {
                newProp = string_format_1.convertSnakeToCamel(oldProp);
            }
            newObject[newProp] = data[oldProp];
            // Object or array
            if (typeof newObject[newProp] === 'object') {
                newObject[newProp] = convertProperties(newObject[newProp], direction);
            }
        }
    }
    if (newObject != null)
        return newObject;
    return data;
}
exports.convertProperties = convertProperties;
/**
 * Convert all properties in an object from `snake_case` to `camelCase`.
 *
 * @param data - Some data in various formats.
 *
 * @returns Possibly an new object is returned. One should always use
 *   this returned object. Do not rely on the by reference passed in
 *   object `data`.
 */
function convertPropertiesSnakeToCamel(data) {
    return convertProperties(data, PropertyConvertDirection.SNAKE_TO_CAMEL);
}
exports.convertPropertiesSnakeToCamel = convertPropertiesSnakeToCamel;
/**
 * Convert all properties in an object from `camelCase` to `snake_case`.
 *
 * @param data - Some data in various formats.
 *
 * @returns Possibly an new object is returned. One should always use
 *   this returned object. Do not rely on the by reference passed in
 *   object `data`.
 */
function convertPropertiesCamelToSnake(data) {
    return convertProperties(data, PropertyConvertDirection.CAMEL_TO_SNAKE);
}
exports.convertPropertiesCamelToSnake = convertPropertiesCamelToSnake;
/**
 * A container class to store a deep copy of an object. This class can be
 * used to detect unexpected properties in an object indexed by strings.
 */
class RawDataObject {
    constructor(rawData) {
        this.raw = deepCopy(rawData);
    }
    /**
     * Cut a property from the raw object, that means delete the property and
     * return the value.
     *
     * @param property - The property of the object.
     *
     * @returns The data stored in the property
     */
    cut(property) {
        if ({}.hasOwnProperty.call(this.raw, property)) {
            const out = this.raw[property];
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete this.raw[property];
            return out;
        }
    }
    /**
     * Assert if the raw data object is empty.
     */
    isEmpty() {
        if (Object.keys(this.raw).length === 0)
            return true;
        return false;
    }
    /**
     * Throw an exception if the stored raw data is not empty yet.
     */
    throwExecptionIfNotEmpty() {
        if (!this.isEmpty()) {
            throw Error(`Unknown properties in raw object: ${convertToString(this.raw)}`);
        }
    }
}
exports.RawDataObject = RawDataObject;
