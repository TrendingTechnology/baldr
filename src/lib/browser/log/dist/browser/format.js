import { printf } from 'fast-printf';
import * as color from './color';
// eslint-disable-next-line no-control-regex
const ansiRegexp = /\u001b\[.*?m/;
export function formatWithoutColor(template, ...args) {
    if (typeof template === 'number') {
        template = template.toString();
    }
    return printf(template, ...args);
}
function colorizeArgs(args, colorFunction) {
    return args.map(value => {
        if (typeof value === 'number') {
            value = value.toString();
        }
        if (typeof value !== 'string' ||
            (typeof value === 'string' && (value === null || value === void 0 ? void 0 : value.match(ansiRegexp)) != null)) {
            return value;
        }
        return colorFunction(value);
    });
}
export function format(template, ...args) {
    args = colorizeArgs(args, color.yellow);
    return formatWithoutColor(template, ...args);
}
export function colorizeFormat(template, args, colorFunction) {
    args = colorizeArgs(args, colorFunction);
    return formatWithoutColor(template, ...args);
}
export function detectFormatTemplate(msg, colorFunction) {
    const firstArg = msg[0];
    if (typeof firstArg === 'number' || typeof firstArg === 'string') {
        return [colorizeFormat(firstArg, msg.slice(1), colorFunction)];
    }
    return msg;
}
/**
 * Format a string indexed object.
 *
 * ```
 * ref:        Konzertkritik
 * uuid:       13fb6aa9-9c07-4b5c-a113-d259d9caad8d
 * title:      Interpreten und Interpretationen im Spiegel der Musikkritik
 * subtitle:   <em class="person">Ludwig van Beethoven</em>: <em class="piece">Klaviersonate f-Moll op. 57 „Appassionata“</em> (1807)
 * subject:    Musik
 * grade:      12
 * curriculum: Interpreten und Interpretationen / Konzertierende Musiker
 * ```
 *
 * @param object - A object with string properties.
 * @param options - Some options. See interface
 *
 * @returns A formatted string containing line breaks.
 */
export function formatObject(object, options) {
    let keys;
    if ((options === null || options === void 0 ? void 0 : options.keys) != null) {
        keys = options.keys;
    }
    else {
        keys = [];
        for (const key in object) {
            if (Object.prototype.hasOwnProperty.call(object, key) &&
                object[key] != null) {
                keys.push(key);
            }
        }
    }
    let maxKeyLength = 0;
    for (const key of keys) {
        if (key.length > maxKeyLength) {
            maxKeyLength = key.length;
        }
    }
    let indentation = 0;
    if ((options === null || options === void 0 ? void 0 : options.indentation) != null) {
        indentation = options.indentation;
    }
    const output = [];
    for (const key of keys) {
        const keyWithSpaces = color.blue(key) + ':' + ' '.repeat(maxKeyLength - key.length);
        output.push(printf('%s%s %s', ' '.repeat(indentation), color.blue(keyWithSpaces), object[key]));
    }
    return output.join('\n');
}
