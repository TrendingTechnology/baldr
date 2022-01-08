import * as fs from 'fs-extra';
import * as path from 'path';
export function parseSongIDList(listPath) {
    const content = fs.readFileSync(listPath, { encoding: 'utf-8' });
    return content.split(/\s+/).filter(songId => songId);
}
/**
 * List files in a folder. You have to use a filter string to select the files.
 * The resulting array of file names is sorted.
 *
 * @param folderPath - The path of the directory.
 * @param regExp - A regular expression to filter, e. g. “\.eps$”.
 *
 * @return An array of file names.
 */
export function listFiles(folderPath, regExp) {
    if (fs.existsSync(folderPath)) {
        return fs
            .readdirSync(folderPath)
            .filter(file => {
            return file.match(regExp);
        })
            .sort(undefined);
    }
    return [];
}
/**
 * Delete all files matching a filter string in a specified folder.
 *
 * @param folderPath - The path of the folder.
 * @param regExp - A regular expression to filter, e. g. “.eps”.
 */
export function deleteFiles(folderPath, regExp) {
    const oldFiles = listFiles(folderPath, regExp);
    for (const oldFile of oldFiles) {
        fs.unlinkSync(path.join(folderPath, oldFile));
    }
}
