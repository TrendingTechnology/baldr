/**
 * Base class for the asset and presentation class.
 */
declare class MediaFile {
    /**
     * The absolute path of the file.
     */
    protected absPath: string;
    /**
     * @param {string} filePath - The file path of the media file.
     */
    constructor(filePath: string);
    /**
     * The file extension of the media file.
     */
    get extension(): string | undefined;
    /**
     * The basename (filename without extension) of the file.
     */
    get basename(): string;
}
/**
 * A media asset.
 */
export declare class Asset extends MediaFile {
    private metaData;
    /**
     * @param {string} filePath - The file path of the media asset.
     */
    constructor(filePath: string);
}
export {};
