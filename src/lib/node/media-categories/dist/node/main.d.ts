export { getTwoLetterRegExp } from './two-letter-abbreviations';
export * as categoriesManagement from './management';
export * from './specs';
export declare const twoLetterAbbreviations: {
    [abbreviation: string]: string;
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
