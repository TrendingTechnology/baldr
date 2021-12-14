export interface MediaData {
    relPath: string;
    [property: string]: any;
}
/**
 * Base class to be extended.
 */
export declare abstract class Builder {
    /**
     * Absolute path of the media file, not the metadata file.
     */
    protected absPath: string;
    constructor(filePath: string);
    protected get relPath(): string;
    importYamlFile(filePath: string, target: any): Builder;
    abstract buildAll(): Builder;
    abstract export(): MediaData;
}
