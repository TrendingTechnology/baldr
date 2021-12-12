/**
 * Treat strings as if they were file paths.
 */
/**
 * Generate the n-th file name or the URL from a file name or a URL of the first
 * element of a multipart asset. The parameter `firstFileName` must have a
 * extension (for example `.jpg`). The parameter `no` must be less then 1000.
 * Only tree digit or smaller integers are allowed.
 *
 * 1. `multipart-asset.jpg`
 * 2. `multipart-asset_no002.jpg`
 * 3. `multipart-asset_no003.jpg`
 * 4. ...
 *
 * @param firstFileName - A file name, a path or a URL.
 * @param no - The number in the multipart asset list. The first element has the
 *   number 1.
 *
 * @return The possibly changed file name, file path or URL with the suffix `_noXXX`.
 *
 * @throws if no is greater than 999.
 * @throws if no is no integer.
 * @throws if firstFileName includes no extension.
 */
export declare function formatMultiPartAssetFileName(firstFileName: string, no: number): string;
/**
 * Get the extension from a file path.
 *
 * @param filePath - A file path or a single file name.
 *
 * @returns The file extension in lower case.
 *
 * @throws Throws an exception if not file extension can be found.
 */
export declare function getExtension(filePath: string): string;
