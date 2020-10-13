/**
 * Manage the media files in the media server directory (create,
 * normalize metadata files, rename media files, normalize the
 * presentation content file).
 *
 * @module @bldr/media-manager
 */
interface Meta {
    curriculumUrl: string;
    id: string;
    title: string;
    subtitle: string;
    curriculum: string;
    grade: number;
}
interface Presentation {
    meta: Meta;
}
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
 * Write some text content into a file.
 *
 * @param filePath - A path of a text file.
 * @param content - Some text to write to a file.
 */
export declare function writeFile(filePath: string, content: string): void;
interface MoveAssetConfiguration {
    copy: boolean;
    dryRun: boolean;
}
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
 * @returns The parse YAML file as a object.
 */
export declare function loadYaml(filePath: string): Presentation | MediaAsset | object;
/**
 * Normalize a presentation file.
 *
 * Remove unnecessary single quotes around media URIs.
 *
 * @param filePath - A path of a text file.
 */
export declare function normalizePresentationFile(filePath: string): void;
export {};
