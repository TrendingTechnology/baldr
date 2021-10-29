import { deepCopy, convertToString } from '@bldr/core-browser';
/**
 * A container class to store a deep copy of an object. This class can be
 * used to detect unexpected properties in an object.
 */
export class DataCutter {
    constructor(rawData) {
        this.raw = deepCopy(rawData);
    }
    get keys() {
        return Object.keys(this.raw);
    }
    /**
     * @throws {Error} If the value under the stored property name is not a string.
     */
    checkString(propertyName) {
        if (typeof this.raw[propertyName] !== 'string') {
            throw new Error(`The value of the property “${propertyName}” is not a string: ${convertToString(this.raw[propertyName])}.`);
        }
    }
    /**
     * @throws {Error} If the value under the stored property name is not a number.
     */
    checkNumber(propertyName) {
        if (typeof this.raw[propertyName] !== 'number') {
            throw new Error(`The value of the property “${propertyName}” is not a number: ${convertToString(this.raw[propertyName])}.`);
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
    /**
     * Cut a property from the raw object, that means delete the property.
     *
     * @param propertyName - The property of the object.
     *
     * @returns The data stored in the property
     */
    cutAny(propertyName) {
        if (this.raw[propertyName] != null) {
            const result = this.raw[propertyName];
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete this.raw[propertyName];
            return result;
        }
    }
    cutString(propertyName) {
        if (this.raw[propertyName] == null) {
            return;
        }
        this.checkString(propertyName);
        return this.cutAny(propertyName);
    }
    cutStringNotNull(propertyName) {
        this.checkNull(propertyName);
        this.checkString(propertyName);
        return this.cutAny(propertyName);
    }
    cutNumberNotNull(propertyName) {
        this.checkNull(propertyName);
        this.checkNumber(propertyName);
        return this.cutAny(propertyName);
    }
    cutNotNull(propertyName) {
        this.checkNull(propertyName);
        return this.cutAny(propertyName);
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
            throw Error(`Unknown properties in raw object: ${convertToString(this.raw)}`);
        }
    }
}
