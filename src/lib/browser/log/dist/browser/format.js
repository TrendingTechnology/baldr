import { printf } from 'fast-printf';
import * as color from './color';
export const colorize = color;
// eslint-disable-next-line no-control-regex
const ansiRegexp = /\u001b\[.*?m/;
export function formatWithoutColor(template, ...args) {
    if (typeof template === 'number') {
        template = template.toString();
    }
    return printf(template, ...args);
}
export function format(template, ...args) {
    args = args.map(value => {
        if (typeof value !== 'string' || (typeof value === 'string' && (value === null || value === void 0 ? void 0 : value.match(ansiRegexp)) != null)) {
            return value;
        }
        return color.yellow(value);
    });
    return formatWithoutColor(template, ...args);
}
export function detectFormatTemplate(...msg) {
    const args = [...arguments];
    const firstArg = arguments[0];
    if (typeof firstArg === 'number' || typeof firstArg === 'string') {
        return [format(firstArg, ...args.slice(1))];
    }
    return args;
}
