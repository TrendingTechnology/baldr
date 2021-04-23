/**
 * Some basic Typescript interfaces and type defintions.
 *
 * @module @bldr/type-definitions/asset
 */
/**
 * The metadata YAML file format.
 *
 * This interface corresponds to the structure of the YAML files
 * `*.extension.yml`. The most frequently used properties are explicitly
 * specified.
 */
export interface FileFormat {
    id: string;
    uuid: string;
    categories?: string;
    extension?: string;
    mainImage?: string;
    filePath?: string;
    [key: string]: any;
}
/**
 * Exported from the media server REST API
 */
export interface RestApiRaw {
    assetType: string;
    extension: string;
    filename: string;
    /**
     * Relative path
     */
    path: string;
    previewImage: boolean;
    size: number;
    timeModified: number;
    uuid: string;
    id: string;
}
/**
 * A type for the possible property names.
 */
export declare type PropName = 'id' | 'uuid' | 'categories' | 'extension' | 'mainImage' | 'filePath';
/**
 * Generic type of the Media asset file format.
 */
export interface Generic {
    [key: string]: any;
}
