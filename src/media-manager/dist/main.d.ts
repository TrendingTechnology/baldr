/**
 * Manage the media files in the media server directory (create,
 * normalize metadata files, rename media files, normalize the
 * presentation content file).
 *
 * @module @bldr/media-manager
 */
import { DeepTitle, TitleTree } from './titles';
import { PresentationType } from '@bldr/type-definitions';
interface MediaAsset {
    cover_source: string;
}
/**
 * Read the content of a text file in the `utf-8` format.
 *
 * A wrapper around `fs.readFileSync()`
 *
 * @param filePath - A path of a text file.
 *
 * @returns The content of the file in the `utf-8` format.
 */
export declare function readFile(filePath: string): string;
/**
 * Convert a Javascript object into a text string, ready to be written
 * into a text file. The property names are converted to `snake_case`.
 *
 * @param data - Some data to convert to YAML.
 *
 * @returns A string in the YAML format ready to be written into a text
 *   file. The result string begins with `---`.
 */
export declare function yamlToTxt(data: any): string;
interface MoveAssetConfiguration {
    copy: boolean;
    dryRun: boolean;
}
/**
 * Write some text content into a file.
 *
 * @param filePath - A path of a text file.
 * @param content - Some text to write to a file.
 */
export declare function writeFile(filePath: string, content: string): void;
/**
 * Convert some data (usually Javascript objets) into the YAML format
 * and write the string into a text file.
 *
 * @param filePath - The file path of the destination yaml file. The yml
 *   extension has to be included.
 * @param data - Some data to convert into yaml and write into a text
 *   file.
 *
 * @returns The data converted to YAML as a string.
 */
export declare function writeYamlFile(filePath: string, data: object): string;
/**
 * Move (rename) or copy a media asset and it’s corresponding meta data file
 * (`*.yml`) and preview file (`_preview.jpg`).
 *
 * @param oldPath - The old path of a media asset.
 * @param newPath - The new path of a media asset.
 * @param opts - Some options
 */
export declare function moveAsset(oldPath: string, newPath: string, opts?: MoveAssetConfiguration): string | undefined;
/**
 * Download a URL to a destination.
 *
 * @param url - The URL.
 * @param dest - The destination. Missing parent directories are
 *   automatically created.
 */
export declare function fetchFile(url: string, dest: string): Promise<void>;
/**
 * Load a YAML file. Return only objects to save vscode type checks.
 *
 * @param filePath - The path of a YAML file.
 *
 * @returns The parsed YAML file as a object. The string properties are
 * in the camleCase format.
 */
export declare function loadYaml(filePath: string): PresentationType.FileFormat | MediaAsset | object;
/**
 * Normalize a presentation file.
 *
 * Remove unnecessary single quotes around media URIs.
 *
 * @param filePath - A path of a text file.
 */
export declare function normalizePresentationFile(filePath: string): void;
declare const _default: {
    DeepTitle: typeof DeepTitle;
    TitleTree: typeof TitleTree;
};
export default _default;
