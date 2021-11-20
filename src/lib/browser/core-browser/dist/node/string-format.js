"use strict";
/**
 * Format functions to manipulate strings.
 *
 * @module @bldr/core-browser/string-format
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deasciify = exports.referencify = exports.asciify = exports.stripTags = exports.toTitleCase = exports.convertDurationToSeconds = exports.formatToLocalDateTime = exports.formatToYear = exports.formatToLocalDate = exports.shortenText = exports.formatWikicommonsUrl = exports.formatImslpUrl = exports.formatYoutubeUrl = exports.formatMusicbrainzWorkUrl = exports.formatMusicbrainzRecordingUrl = exports.formatWikipediaUrl = exports.formatWikidataUrl = exports.formatMultiPartAssetFileName = exports.convertHtmlToPlainText = exports.escapeHtml = void 0;
const transliteration_1 = require("transliteration");
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
 * Get the plain text version of a HTML string.
 *
 * @param html - A HTML formated string.
 *
 * @returns The plain text version.
 */
function convertHtmlToPlainText(html) {
    var _a;
    if (html == null) {
        return '';
    }
    // To get spaces between heading and paragraphs
    html = html.replace(/></g, '> <');
    const markup = new DOMParser().parseFromString(html, 'text/html');
    return (_a = markup.body.textContent) !== null && _a !== void 0 ? _a : '';
}
exports.convertHtmlToPlainText = convertHtmlToPlainText;
/**
 * Generate the n-th file name or the URL from a file name or a URL of the first
 * element of a multipart asset. The parameter `firstFileName` must have a
 * extension (for example `.jpg`). The parameter `no` must be less then 1000.
 * Only tree digit or smaller integers are allowed.
 *
 * 1. `multipart-asset.jpg`
 * 2. `multipart-asset_no002.jpg`
 * 3. `multipart-asset_no003.jpg`
 * 4. ...
 *
 * @param firstFileName - A file name, a path or a URL.
 * @param no - The number in the multipart asset list. The first element has the
 *   number 1.
 */
function formatMultiPartAssetFileName(firstFileName, no) {
    if (!Number.isInteger(no)) {
        no = 1;
    }
    if (no > 999) {
        throw new Error(`${firstFileName}: The multipart asset number must not be greater than 999.`);
    }
    let suffix;
    if (no === 1) {
        return firstFileName;
    }
    else if (no < 10) {
        suffix = `_no00${no}`;
    }
    else if (no < 100) {
        suffix = `_no0${no}`;
    }
    else {
        suffix = `_no${no}`;
    }
    return firstFileName.replace(/(\.\w+$)/, `${suffix}$1`);
}
exports.formatMultiPartAssetFileName = formatMultiPartAssetFileName;
/**
 * Format a Wikidata URL.
 * `https://www.wikidata.org/wiki/Q42`
 */
function formatWikidataUrl(id) {
    id = String(id);
    const idNumber = parseInt(id.replace(/^Q/, ''));
    // https://www.wikidata.org/wiki/Q42
    return `https://www.wikidata.org/wiki/Q${idNumber}`;
}
exports.formatWikidataUrl = formatWikidataUrl;
/**
 * Format a Wikipedia URL.
 *
 * https://en.wikipedia.org/wiki/A_Article
 *
 * @param nameSpace - The name space of the Wikipedia article (for
 *   example A_Article or en:A_article)
 */
function formatWikipediaUrl(nameSpace) {
    // https://de.wikipedia.org/wiki/Gesch%C3%BCtztes_Leerzeichen
    // https://en.wikipedia.org/wiki/Non-breaking_space
    const segments = nameSpace.split(':');
    const lang = segments[0];
    const slug = encodeURIComponent(segments[1]);
    return `https://${lang}.wikipedia.org/wiki/${slug}`;
}
exports.formatWikipediaUrl = formatWikipediaUrl;
/**
 * Format a Musicbrainz recording URL.
 *
 * `https://musicbrainz.org/recording/${RecordingId}`
 *
 * @param recordingId
 */
function formatMusicbrainzRecordingUrl(recordingId) {
    return `https://musicbrainz.org/recording/${recordingId}`;
}
exports.formatMusicbrainzRecordingUrl = formatMusicbrainzRecordingUrl;
/**
 * Format a Musicbrainz work URL.
 *
 * `https://musicbrainz.org/work/${WorkId}`
 *
 * @param workId
 */
function formatMusicbrainzWorkUrl(workId) {
    return `https://musicbrainz.org/work/${workId}`;
}
exports.formatMusicbrainzWorkUrl = formatMusicbrainzWorkUrl;
/**
 * Format a YouTube URL.
 *
 * `https://youtu.be/CQYypFMTQcE`
 *
 * @param id - The id of a Youtube video (for example CQYypFMTQcE).
 */
function formatYoutubeUrl(id) {
    return `https://youtu.be/${id}`;
}
exports.formatYoutubeUrl = formatYoutubeUrl;
/**
 * `https://imslp.org/wiki/La_clemenza_di_Tito_(Wagenseil,_Georg_Christoph)`
 *
 * @param id - For example
 *   `La_clemenza_di_Tito_(Wagenseil,_Georg_Christoph)`
 */
function formatImslpUrl(id) {
    return `https://imslp.org/wiki/${id}`;
}
exports.formatImslpUrl = formatImslpUrl;
/**
 * `https://commons.wikimedia.org/wiki/File:Cheetah_(Acinonyx_jubatus)_cub.jpg`
 *
 * @param fileName - For example
 *   `Cheetah_(Acinonyx_jubatus)_cub.jpg`
 */
function formatWikicommonsUrl(fileName) {
    return `https://commons.wikimedia.org/wiki/File:${fileName}`;
}
exports.formatWikicommonsUrl = formatWikicommonsUrl;
/**
 * Shorten a text string. By default the string is shortend to the maximal
 * length 80.
 */
function shortenText(text, options) {
    const defaults = {
        stripTags: false,
        maxLength: 80
    };
    if (options == null) {
        options = defaults;
    }
    else {
        options = Object.assign(defaults, options);
    }
    if (text == null)
        return '';
    if (options.stripTags) {
        text = convertHtmlToPlainText(text);
    }
    if (text.length < options.maxLength) {
        return text;
    }
    // https://stackoverflow.com/a/5454303
    // trim the string to the maximum length
    text = text.substr(0, options.maxLength);
    // re-trim if we are in the middle of a word
    text = text.substr(0, Math.min(text.length, text.lastIndexOf(' ')));
    return `${text} …`;
}
exports.shortenText = shortenText;
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
    return (0, transliteration_1.transliterate)(output);
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
