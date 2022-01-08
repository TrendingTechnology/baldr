import fs from 'fs';
/**
 * Read the content of a text file in the `utf-8` format.
 *
 * A wrapper around `fs.readFileSync()`
 *
 * @param filePath - A path of a text file.
 *
 * @returns The content of the file in the `utf-8` format.
 */
export function readFile(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`The file “${filePath}” cannot be read because it does not exist.`);
    }
    return fs.readFileSync(filePath, { encoding: 'utf-8' });
}
/**
 * Write some text content into a file.
 *
 * @param filePath - A path of a text file.
 * @param content - Some text to write to a file.
 */
export function writeFile(filePath, content) {
    fs.writeFileSync(filePath, content);
    return content;
}
