/**
 * Extract a string value from the parsed query string object.
 *
 * @param query - The parsed query string (`?param1=one&param2=two`) as an object.
 * @param key - The name of the query key.
 * @param defaultValue - A default value if the `query` is empty under the
 *   property `propertyName`.
 *
 * @returns The found parameter string or a default value
 *
 * @throws If no result string can be found.
 */
export declare function extractString(query: Record<string, any>, key: string, defaultValue?: string): string;
/**
 * Extract a boolean value from the parsed query string object.
 *
 * @param query - The parsed query string (`?param1=one&param2=two`) as an object.
 * @param key - The name of the query key.
 * @param defaultValue - A default value if the `query` is empty under the
 *   property `propertyName`.
 *
 * @returns The found parameter boolean or a default value
 *
 * @throws If no result boolean can be found.
 */
export declare function extractBoolean(query: Record<string, any>, key: string, defaultValue?: boolean): boolean;
