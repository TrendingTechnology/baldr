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
export function formatObject(obj, options) {
    let indentation = 0;
    if ((options === null || options === void 0 ? void 0 : options.indentation) != null) {
        indentation = options.indentation;
    }
    const output = [];
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key] != null) {
            output.push(printf('%s%s: %s', ' '.repeat(indentation), color.blue(key), obj[key]));
        }
    }
    return output.join('\n');
}
