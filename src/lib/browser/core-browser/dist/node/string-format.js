"use strict";
/**
 * Format functions to manipulate strings.
 *
 * @module @bldr/core-browser/string-format
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deasciify = exports.referencify = exports.asciify = exports.stripTags = exports.toTitleCase = exports.convertDurationToSeconds = exports.formatToLocalDateTime = exports.formatToYear = exports.formatToLocalDate = exports.escapeHtml = void 0;
// import { transliterate } from 'transliteration'
/**
 * Escape some characters with HTML entities.
 *
 * @see {@link https://coderwall.com/p/ostduq/escape-html-with-javascript}
 */
function escapeHtml(htmlString) {
    // List of HTML entities for escaping.
    const htmlEscapes = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;'
    };
    // Regex containing the keys listed immediately above.
    const htmlEscaper = /[&<>"'/]/g;
    // Escape a string for HTML interpolation.
    return ('' + htmlString).replace(htmlEscaper, function (match) {
        return htmlEscapes[match];
    });
}
exports.escapeHtml = escapeHtml;
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
 * Convert a duration string (8:01 = 8 minutes 1 seconds or 1:33:12 = 1
 * hour 33 minutes 12 seconds) into seconds.
 */
function convertDurationToSeconds(duration) {
    if (typeof duration === 'number') {
        return duration;
    }
    if (typeof duration === 'string' && duration.match(/:/) != null) {
        const segments = duration.split(':');
        if (segments.length === 3) {
            return (parseInt(segments[0]) * 3600 +
                parseInt(segments[1]) * 60 +
                parseInt(segments[2]));
        }
        else if (segments.length === 2) {
            return parseInt(segments[0]) * 60 + parseInt(segments[1]);
        }
    }
    return Number.parseFloat(duration);
}
exports.convertDurationToSeconds = convertDurationToSeconds;
/**
 * Convert a single word into title case, for example `word` gets `Word`.
 */
function toTitleCase(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}
exports.toTitleCase = toTitleCase;
/**
 * Strip HTML tags from a string.
 *
 * @param text - A text containing HTML tags.
 */
function stripTags(text) {
    return text.replace(/<[^>]+>/g, '');
}
exports.stripTags = stripTags;
/**
 * Convert some unicode strings into the ASCII format.
 */
function asciify(input) {
    const output = String(input)
        .replace(/[\(\)';]/g, '') // eslint-disable-line
        .replace(/[,\.] /g, '_') // eslint-disable-line
        .replace(/ +- +/g, '_')
        .replace(/\s+/g, '-')
        .replace(/[&+]/g, '-')
        .replace(/-+/g, '-')
        .replace(/-*_-*/g, '_')
        .replace(/Ä/g, 'Ae')
        .replace(/ä/g, 'ae')
        .replace(/Ö/g, 'Oe')
        .replace(/ö/g, 'oe')
        .replace(/Ü/g, 'Ue')
        .replace(/ü/g, 'ue')
        .replace(/ß/g, 'ss')
        .replace(/!/g, '');
    // return transliterate(output)
    return output;
}
exports.asciify = asciify;
/**
 * This function can be used to generate IDs from different file names.
 *
 * It performes some addictional replacements which can not be done in `asciify`
 * (`asciffy` is sometimes applied to paths.)
 */
function referencify(input) {
    let output = asciify(input);
    // asciify is used by rename. We can not remove dots because of the exentions
    output = output.replace(/\./g, '');
    //  “'See God's ark' ” -> See-Gods-ark-
    output = output.replace(/^[^A-Za-z0-9]*/, '');
    output = output.replace(/[^A-Za-z0-9]*$/, '');
    // Finally remove all non ID characters.
    output = output.replace(/[^A-Za-z0-9-_]+/g, '');
    return output;
}
exports.referencify = referencify;
/**
 * This function can be used to generate a title from an ID string.
 */
function deasciify(input) {
    return String(input)
        .replace(/_/g, ', ')
        .replace(/-/g, ' ')
        .replace(/Ae/g, 'Ä')
        .replace(/ae/g, 'ä')
        .replace(/Oe/g, 'Ö')
        .replace(/oe/g, 'ö')
        .replace(/Ue/g, 'Ü')
        .replace(/ue/g, 'ü');
}
exports.deasciify = deasciify;
