/**
 * Some basic Typescript interfaces and type defintions.
 *
 * @module @bldr/type-definitions/asset
 */
export declare namespace AssetType {
    /**
     * A type for the Metadata YAML file format for media assets.
     */
    interface FileFormat {
        id: string;
        uuid: string;
        metaTypes?: string;
        extension?: string;
        mainImage?: string;
        filePath?: string;
        [key: string]: any;
    }
    /**
     * A type for the possible property names.
     */
    type PropName = 'id' | 'uuid' | 'metaTypes' | 'extension' | 'mainImage' | 'filePath';
    /**
     * Generic type of the Media asset file format.
     */
    interface Generic {
        [key: string]: any;
    }
}
