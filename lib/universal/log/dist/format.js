import { printf } from 'fast-printf';
import * as color from './color';
// eslint-disable-next-line no-control-regex
const ansiRegexp = /\u001b\[.*?m/;
/**
 * @param index - Index number starting from 0.
 * @param colorSpecs - See types.
 *
 * @returns A color function.
 */
function getColorFunctionByIndex(index, colorSpecs) {
    if (colorSpecs == null) {
        return color.getColorFunction('yellow');
    }
    if (typeof colorSpecs === 'string') {
        return color.getColorFunction(colorSpecs);
    }
    if (index < colorSpecs.length) {
        return color.getColorFunction(colorSpecs[index]);
    }
    return color.getColorFunction(colorSpecs[colorSpecs.length - 1]);
}
function colorizeArgs(args, colorSpecs) {
    if (typeof colorSpecs === 'string') {
        colorSpecs = [colorSpecs];
    }
    for (let index = 0; index < args.length; index++) {
        let arg = args[index];
        // to get %f support
        // if (typeof arg === 'number') {
        //   arg = arg.toString()
        // }
        if (typeof arg === 'string' && arg.match(ansiRegexp) == null) {
            arg = getColorFunctionByIndex(index, colorSpecs)(arg);
        }
        args[index] = arg;
    }
    return args;
}
function generatePrefix(colorSpecs) {
    return getColorFunctionByIndex(0, colorSpecs)('█') + ' ';
}
/**
 * @param template - A string in the “printf” format:
 *
 * - `%c` character
 * - `%C` converts to uppercase character (if not already)
 * - `%d` decimal integer (base 10)
 * - `%0Xd` zero-fill for X digits
 * - `%Xd` right justify for X digits
 * - `%-Xd` left justify for X digits
 * - `%+d` adds plus sign(+) to positive integers, minus sign for negative integers(-)
 * - `%e` scientific notation
 * - `%E` scientific notation with a capital 'E'
 * - `%f` floating-point number
 * - `%.Yf` prints Y positions after decimal
 * - `%Xf` takes up X spaces
 * - `%0X.Yf` zero-fills
 * - `%-X.Yf` left justifies
 * - `%i` integer (base 10)
 * - `%b` converts to boolean
 * - `%B` converts to uppercase boolean
 * - `%o` octal number (base 8)
 * - `%s` a string of characters
 * - `%Xs` formats string for a minimum of X spaces
 * - `%-Xs` left justify
 * - `%S` converts to a string of uppercase characters (if not already)
 * - `%u` unsigned decimal integer
 * - `%x` number in hexadecimal (base 16)
 * - `%%` prints a percent sign
 * - `\%` prints a percent sign
 * - `%2$s %1$s` positional arguments
 */
export function format(template, args, options) {
    let colorSpecs;
    if (typeof options === 'string' || Array.isArray(options)) {
        colorSpecs = options;
    }
    else if ((options === null || options === void 0 ? void 0 : options.colors) != null) {
        colorSpecs = options.colors;
    }
    if (args != null) {
        args = colorizeArgs(args, colorSpecs);
    }
    else {
        args = [];
    }
    let result = printf(template, ...args);
    // Handle multiline log messages.
    const prefix = generatePrefix(colorSpecs);
    result = result.replace(/(\r?\n)/g, '$1' + prefix);
    return prefix + result;
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
