/**
 * Manipulate javascript objects.
 *
 * @module @bldr/core-browser/object-manipulation
 */
/**
 * Convert various data to a string. Meant for error messages. Objects
 * are converted to a string using `JSON.stringify`
 *
 * @param data - Various data in various types.
 */
export declare function convertToString(data: any): string;
/**
 * Create a deep copy of an object. This functions uses the two methods
 * `JSON.parse()` and `JSON.stringify()` to accomplish its task.
 *
 * @param data
 */
export declare function deepCopy(data: object): object;
/**
 * A container class to store a deep copy of an object. This class can be
 * used to detect unexpected properties in an object indexed by strings.
 *
 * @TODO replace with src/lib/browser/presentation-parser/src/data-management.ts DataCutter
 */
export declare class RawDataObject {
    /**
     * The raw data object.
     */
    raw: {
        [key: string]: any;
    };
    constructor(rawData: object);
    /**
     * Cut a property from the raw object, that means delete the property and
     * return the value.
     *
     * @param property - The property of the object.
     *
     * @returns The data stored in the property
     */
    cut(property: string): any;
    /**
     * Assert if the raw data object is empty.
     */
    isEmpty(): boolean;
    /**
     * Throw an exception if the stored raw data is not empty yet.
     */
    throwExecptionIfNotEmpty(): void;
}
/**
 * Grab / select values from two objects. The first object is preferred. The
 * first object can be for example props and the second a object from the media
 * server.
 */
export declare class ObjectPropertyPicker {
    private readonly object1;
    private readonly object2;
    constructor(object1: Record<string, any>, object2: Record<string, any>);
    /**
     * Grab a value from two objects.
     *
     * @param propName - The name of property to look for
     */
    pickProperty(propName: string): string | undefined;
    /**
     * Grab multiple properties.
     *
     * @param properties - An array of property names.
     *
     * @returns A new object containing the key and value pairs.
     */
    pickMultipleProperties(properties: string[]): Record<string, any>;
}
