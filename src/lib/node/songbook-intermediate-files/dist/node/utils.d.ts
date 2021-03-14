export declare function parseSongIDList(listPath: string): string[];
/**
 * List files in a folder. You have to use a filter string to select the files.
 * The resulting array of file names is sorted.
 *
 * @param folderPath - The path of the directory.
 * @param filter - String to filter, e. g. “.eps”.
 *
 * @return An array of file names.
 */
export declare function listFiles(folderPath: string, filter: string): string[];
/**
 * Delete all files matching a filter string in a specified folder.
 *
 * @param folderPath - The path of the folder.
 * @param filter - String to filter, e. g. “.eps”.
 */
export declare function deleteFiles(folderPath: string, filter: string): void;
