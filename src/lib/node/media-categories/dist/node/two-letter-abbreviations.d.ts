import { MediaCategoriesTypes } from '@bldr/type-definitions';
export declare const abbreviations: {
    [abbreviation: string]: string;
};
export declare function isValidTwoLetterAbbreviation(abbreviation: string): boolean;
export declare function getTwoLetterAbbreviations(): string[];
export declare function getTwoLetterRegExp(): string;
/**
 * Check if the given file path is in a valid two letter directory.
 *
 * @param filePath A file path, for example
 * `../30_Funktionen-Filmmusik/HB/Bach_Aria-Orchestersuite.m4a.yml`
 *
 * @return True if the file path is in a valid two letter directory, else false.
 */
export declare function checkForTwoLetterDir(filePath: string): boolean;
export declare function checkTypeAbbreviations(categoryCollection: MediaCategoriesTypes.Collection): void;
