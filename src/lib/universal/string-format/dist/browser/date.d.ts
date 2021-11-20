/**
 * @param duration - in seconds
 *
 * @return `01:23`
 */
export declare function formatDuration(duration: number | string, short?: boolean): string;
/**
 * Get the current school year. The function returns year in which the school year begins.
 *
 * @returns The year in which the school year begins, for example `2021/22`: `2021`
 */
export declare function getCurrentSchoolYear(): number;
/**
 * @returns e. g. `2021/22`
 */
export declare function getFormatedSchoolYear(): string;
/**
 * Format a timestamp into a string like this example: `Mo 17.2.2020 07:57:53`
 *
 * @param timeStampMsec - The timestamp in milliseconds.
 */
export declare function formatToLocalDateTime(timeStampMsec: number): string;
/**
 * Convert a duration string (8:01 = 8 minutes 1 seconds or 1:33:12 = 1
 * hour 33 minutes 12 seconds) into seconds.
 */
export declare function convertDurationToSeconds(duration: string | number): number;
/**
 * Format a date specification string into a local date string, for
 * example `28. August 1749`
 *
 * @param dateSpec - A valid input for the `Date()` class. If the input
 *   is invalid the raw `dateSpec` is returned.
 */
export declare function formatToLocalDate(dateSpec: string): string;
/**
 * Extract the 4 digit year from a date string
 *
 * @param dateSpec - For example `1968-01-01`
 *
 * @returns for example `1968`
 */
export declare function formatToYear(dateSpec: string): string;
