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
export function extractString(query, key, defaultValue) {
    if (query[key] == null || typeof query[key] !== 'string') {
        if (defaultValue != null) {
            return defaultValue;
        }
        else {
            throw new Error(`No value could be found for the query string parameter “${key}” in the parsed query object.`);
        }
    }
    return query[key];
}
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
export function extractBoolean(query, key, defaultValue) {
    if (key in query) {
        const value = query[key];
        if (value === false ||
            value === 'false' ||
            value === 'FALSE' ||
            value === '0' ||
            value === 0) {
            return false;
        }
        return true;
    }
    if (defaultValue != null) {
        return defaultValue;
    }
    throw new Error(`No value could be found for the boolean query parameter “${key}” in the parsed query object.`);
}
