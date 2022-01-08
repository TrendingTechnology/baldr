/**
 * Extract the 4 digit year from a date string
 *
 * @param dateSpec - For example `1968-01-01`
 *
 * @returns for example `1968`
 */
export declare function formatToYear(dateSpec: string): string;
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
 * Format a date specification string into a local date string, for example `28.
 * August 1749`
 *
 * @param dateSpec - A valid input for the `Date()` class, for example
 *   `1978-12-03`. If the input is invalid the raw `dateSpec` is returned.
 *
 * @returns For example `28. August 1749`
 */
export declare function formatToLocalDate(dateSpec: string): string;
/**
 * Format a timestamp into a string like this example: `Mo 17.2.2020 07:57:53`
 *
 * @param timeStampMsec - The timestamp in milliseconds.
 */
export declare function formatToLocalDateTime(timeStampMsec: number): string;
/**
 * @param duration - in seconds
 *
 * @return `01:23`
 */
export declare function convertSecondsToHHMMSS(duration: number | string, short?: boolean): string;
/**
 * Convert a duration string (`8:01` = 8 minutes 1 seconds or `1:33:12` = 1
 * hour 33 minutes 12 seconds) into seconds.
 *
 * @param duration - Possible formats are
 *
 * - number (integer or float)
 * - Colon separated string with one colon: `01:00` == `mm:ss`
 * - Colon separated string with two colon: `01:00:00` == `hh:mm:ss`
 * - Colon separated string with float suffix: `01:00:00.23`
 *
 * @returns The duration in seconds as a number.
 */
export declare function convertHHMMSSToSeconds(duration: string | number): number;
