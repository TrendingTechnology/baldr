"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatToYear = exports.formatToLocalDate = exports.convertDurationToSeconds = exports.formatToLocalDateTime = exports.getFormatedSchoolYear = exports.getCurrentSchoolYear = exports.formatDuration = void 0;
/**
 * @param duration - in seconds
 *
 * @return `01:23`
 */
function formatDuration(duration, short = false) {
    duration = Number(duration);
    let from = 11;
    let length = 8;
    if (duration < 3600 && short) {
        from = 14;
        length = 5;
    }
    return new Date(Number(duration) * 1000).toISOString().substr(from, length);
}
exports.formatDuration = formatDuration;
/**
 * Get the current school year. The function returns year in which the school year begins.
 *
 * @returns The year in which the school year begins, for example `2021/22`: `2021`
 */
function getCurrentSchoolYear() {
    const date = new Date();
    // getMonth: 0 = January
    // 8 = September
    if (date.getMonth() < 8) {
        return date.getFullYear() - 1;
    }
    return date.getFullYear();
}
exports.getCurrentSchoolYear = getCurrentSchoolYear;
/**
 * @returns e. g. `2021/22`
 */
function getFormatedSchoolYear() {
    const year = getCurrentSchoolYear();
    const endYear = year + 1;
    const endYearString = endYear.toString().substr(2);
    return `${year.toString()}/${endYearString}`;
}
exports.getFormatedSchoolYear = getFormatedSchoolYear;
/**
 * Format a timestamp into a string like this example: `Mo 17.2.2020 07:57:53`
 *
 * @param timeStampMsec - The timestamp in milliseconds.
 */
function formatToLocalDateTime(timeStampMsec) {
    const date = new Date(Number(timeStampMsec));
    const dayNumber = date.getDay();
    let dayString;
    if (dayNumber === 0) {
        dayString = 'So';
    }
    else if (dayNumber === 1) {
        dayString = 'Mo';
    }
    else if (dayNumber === 2) {
        dayString = 'Di';
    }
    else if (dayNumber === 3) {
        dayString = 'Mi';
    }
    else if (dayNumber === 4) {
        dayString = 'Do';
    }
    else if (dayNumber === 5) {
        dayString = 'Fr';
    }
    else if (dayNumber === 6) {
        dayString = 'Sa';
    }
    else {
        dayString = '';
    }
    const dateString = date.toLocaleDateString();
    const timeString = date.toLocaleTimeString();
    return `${dayString} ${dateString} ${timeString}`;
}
exports.formatToLocalDateTime = formatToLocalDateTime;
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
function convertDurationToSeconds(duration) {
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    if (typeof duration === 'number') {
        seconds = duration;
    }
    else if (typeof duration === 'string' && duration.includes(':')) {
        const segments = duration.split(':');
        if (segments.length < 2 || segments.length > 3) {
            throw new Error(`Invalid duration string ${duration}: Only one or two colons are allowed!`);
        }
        if (segments.length === 3) {
            hours = Number.parseFloat(segments[0]);
        }
        minutes = Number.parseFloat(segments[segments.length - 2]);
        seconds = Number.parseFloat(segments[segments.length - 1]);
        if (seconds >= 60) {
            throw new Error(`Invalid duration string “${duration}”: The number of seconds must be less than 60!`);
        }
    }
    else {
        seconds = Number.parseFloat(duration);
    }
    if (minutes >= 60) {
        throw new Error(`Invalid duration string “${duration}”: The number of minutes must be less than 60!`);
    }
    return hours * 3600 + minutes * 60 + seconds;
}
exports.convertDurationToSeconds = convertDurationToSeconds;
/**
 * Format a date specification string into a local date string, for
 * example `28. August 1749`
 *
 * @param dateSpec - A valid input for the `Date()` class. If the input
 *   is invalid the raw `dateSpec` is returned.
 */
function formatToLocalDate(dateSpec) {
    const date = new Date(dateSpec);
    // Invalid date
    if (isNaN(date.getDay()))
        return dateSpec;
    const months = [
        'Januar',
        'Februar',
        'März',
        'April',
        'Mai',
        'Juni',
        'Juli',
        'August',
        'September',
        'Oktober',
        'November',
        'Dezember'
    ];
    // Not getDay()
    return `${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}`;
}
exports.formatToLocalDate = formatToLocalDate;
/**
 * Extract the 4 digit year from a date string
 *
 * @param dateSpec - For example `1968-01-01`
 *
 * @returns for example `1968`
 */
function formatToYear(dateSpec) {
    return dateSpec.substr(0, 4);
}
exports.formatToYear = formatToYear;
