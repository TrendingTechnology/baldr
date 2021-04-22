export declare const categoriesManagement: {
    detectCategoryByPath: (filePath: string) => string | undefined;
    formatFilePath: (data: import("@bldr/type-definitions/dist/node/asset").FileFormat, oldPath?: string | undefined) => string;
    process: (data: import("@bldr/type-definitions/dist/node/asset").FileFormat) => import("@bldr/type-definitions/dist/node/asset").FileFormat;
    categories: {
        cloze: import("@bldr/type-definitions/dist/node/media-category").Category;
        composition: import("@bldr/type-definitions/dist/node/media-category").Category;
        cover: import("@bldr/type-definitions/dist/node/media-category").Category;
        group: import("@bldr/type-definitions/dist/node/media-category").Category;
        instrument: import("@bldr/type-definitions/dist/node/media-category").Category;
        person: import("@bldr/type-definitions/dist/node/media-category").Category;
        photo: import("@bldr/type-definitions/dist/node/media-category").Category;
        radio: import("@bldr/type-definitions/dist/node/media-category").Category;
        recording: import("@bldr/type-definitions/dist/node/media-category").Category;
        reference: import("@bldr/type-definitions/dist/node/media-category").Category;
        score: import("@bldr/type-definitions/dist/node/media-category").Category;
        song: import("@bldr/type-definitions/dist/node/media-category").Category;
        worksheet: import("@bldr/type-definitions/dist/node/media-category").Category;
        youtube: import("@bldr/type-definitions/dist/node/media-category").Category;
        general: import("@bldr/type-definitions/dist/node/media-category").Category;
    };
    mergeNames: (...name: string[]) => string;
};
export declare const categories: {
    cloze: import("@bldr/type-definitions/dist/node/media-category").Category;
    composition: import("@bldr/type-definitions/dist/node/media-category").Category;
    cover: import("@bldr/type-definitions/dist/node/media-category").Category;
    group: import("@bldr/type-definitions/dist/node/media-category").Category;
    instrument: import("@bldr/type-definitions/dist/node/media-category").Category;
    person: import("@bldr/type-definitions/dist/node/media-category").Category;
    photo: import("@bldr/type-definitions/dist/node/media-category").Category;
    radio: import("@bldr/type-definitions/dist/node/media-category").Category;
    recording: import("@bldr/type-definitions/dist/node/media-category").Category;
    reference: import("@bldr/type-definitions/dist/node/media-category").Category;
    score: import("@bldr/type-definitions/dist/node/media-category").Category;
    song: import("@bldr/type-definitions/dist/node/media-category").Category;
    worksheet: import("@bldr/type-definitions/dist/node/media-category").Category;
    youtube: import("@bldr/type-definitions/dist/node/media-category").Category;
    general: import("@bldr/type-definitions/dist/node/media-category").Category;
};
/**
 * Validate a date string in the format `yyyy-mm-dd`.
 */
export declare function validateDate(value: string): boolean;
/**
 * Validate a ID string of the Baldr media server.
 */
export declare function validateMediaId(value: string): boolean;
/**
 * Validate UUID string (for the Musicbrainz references).
 */
export declare function validateUuid(value: string): boolean;
/**
 * Validate a YouTube ID.
 */
export declare function validateYoutubeId(value: string): boolean;
/**
 * Generate a ID prefix for media assets, like `Presentation-ID_HB` if the
 * path of the media file is `10_Presentation-id/HB/example.mp3`.
 *
 * @param filePath - The media asset file path.
 *
 * @returns The ID prefix.
 */
export declare function generateIdPrefix(filePath: string): string | undefined;
