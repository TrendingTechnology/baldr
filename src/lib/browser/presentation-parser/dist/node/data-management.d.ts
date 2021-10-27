/**
 * A container class to store a deep copy of an object. This class can be
 * used to detect unexpected properties in an object.
 */
export declare class DataCutter {
    /**
     * The raw data object.
     */
    raw: any;
    constructor(rawData: object);
    get keys(): string[];
    /**
     * Cut a property from the raw object, that means delete the property.
     *
     * @param propertyName - The property of the object.
     *
     * @returns The data stored in the property
     */
    private cut;
    /**
     * @throws {Error} If the value under the stored property name is not a string.
     */
    private checkString;
    /**
     * @throws {Error} If the value under the stored property name is not a number.
     */
    private checkNumber;
    /**
     * @throws {Error} If the value under the stored property name is null.
     */
    private checkNull;
    cutString(propertyName: string): string | undefined;
    cutStringNotNull(propertyName: string): string;
    cutNumberNotNull(propertyName: string): number;
    cutNotNull(propertyName: string): any;
    /**
     * Assert if the raw data object is empty.
     */
    isEmpty(): boolean;
    /**
     * Throw an exception if the stored raw data is not empty yet.
     *
     * @throws {Error} If the stored raw data is not empty yet.
     */
    checkEmpty(): void;
}
