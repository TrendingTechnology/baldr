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
 * A type for the possible property names.
 */
export declare type PropName = 'id' | 'uuid' | 'categories' | 'extension' | 'mainImage' | 'filePath';
/**
 * Generic type of the Media asset file format.
 */
export interface Generic {
    [key: string]: any;
}
