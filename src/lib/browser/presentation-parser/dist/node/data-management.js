"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataCutter = void 0;
const core_browser_1 = require("@bldr/core-browser");
/**
 * A container class to store a deep copy of an object. This class can be
 * used to detect unexpected properties in an object.
 */
class DataCutter {
    constructor(rawData) {
        this.raw = core_browser_1.deepCopy(rawData);
    }
    /**
     * Cut a property from the raw object, that means delete the property.
     *
     * @param propertyName - The property of the object.
     *
     * @returns The data stored in the property
     */
    cut(propertyName) {
        if ({}.hasOwnProperty.call(this.raw, propertyName)) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            const result = this.raw[propertyName];
            delete this.raw[propertyName];
            return result;
        }
    }
    /**
     * @throws {Error} If the value under the stored property name is not a string.
     */
    checkString(propertyName) {
        if (typeof this.raw[propertyName] !== 'string') {
            throw new Error(`The value of the property “${propertyName}” is not a string: ${core_browser_1.convertToString(this.raw[propertyName])}.`);
        }
    }
    /**
     * @throws {Error} If the value under the stored property name is not a number.
     */
    checkNumber(propertyName) {
        if (typeof this.raw[propertyName] !== 'number') {
            throw new Error(`The value of the property “${propertyName}” is not a number: ${core_browser_1.convertToString(this.raw[propertyName])}.`);
        }
    }
    /**
     * @throws {Error} If the value under the stored property name is null.
     */
    checkNull(propertyName) {
        if (this.raw[propertyName] == null) {
            throw new Error(`The property “${propertyName}” must not be null.`);
        }
    }
    cutString(propertyName) {
        if (this.raw[propertyName] == null) {
            return;
        }
        this.checkString(propertyName);
        return this.cut(propertyName);
    }
    cutStringNotNull(propertyName) {
        this.checkNull(propertyName);
        this.checkString(propertyName);
        return this.cut(propertyName);
    }
    cutNumberNotNull(propertyName) {
        this.checkNull(propertyName);
        this.checkNumber(propertyName);
        return this.cut(propertyName);
    }
    cutNotNull(propertyName) {
        this.checkNull(propertyName);
        return this.cut(propertyName);
    }
    /**
     * Assert if the raw data object is empty.
     */
    isEmpty() {
        if (Object.keys(this.raw).length === 0) {
            return true;
        }
        return false;
    }
    /**
     * Throw an exception if the stored raw data is not empty yet.
     *
     * @throws {Error} If the stored raw data is not empty yet.
     */
    checkEmpty() {
        if (!this.isEmpty()) {
            throw Error(`Unknown properties in raw object: ${core_browser_1.convertToString(this.raw)}`);
        }
    }
}
exports.DataCutter = DataCutter;
