/**
 * Base class for the asset and presentation class.
 */
declare class MediaFile {
    /**
     * The absolute path of the file.
     */
    protected absPath: string;
    /**
     * @param filePath - The file path of the media file.
     */
    constructor(filePath: string);
    /**
     * The file extension of the media file.
     */
    get extension(): string;
    /**
     * The basename (filename without extension) of the file.
     */
    get basename(): string;
}
/**
 * A media asset.
 */
export declare class Asset extends MediaFile {
    private readonly metaData;
    /**
     * @param filePath - The file path of the media asset.
     */
    constructor(filePath: string);
    /**
     * The reference of the media asset. Read from the metadata file.
     */
    get ref(): string | undefined;
    /**
     * The media category (`image`, `audio`, `video`, `document`)
     */
    get mediaCategory(): string | undefined;
}
/**
 * Make a media asset from a file path.
 *
 * @param filePath - The file path of the media asset.
 */
export declare function makeAsset(filePath: string): Asset;
/**
 * @param filePath - The file path of the media asset.
 */
export declare function filePathToMimeType(filePath: string): string | undefined;
/**
 * Check if the given file is a media asset.
 *
 * @param filePath - The path of the file to check.
 */
export declare function isAsset(filePath: string): boolean;
/**
 * Check if the given file is a presentation.
 *
 * @param filePath - The path of the file to check.
 */
export declare function isPresentation(filePath: string): boolean;
/**
 * Check if the given file is a TeX file.
 *
 * @param filePath - The path of the file to check.
 */
export declare function isTex(filePath: string): boolean;
export {};
