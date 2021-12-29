"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const color_1 = __importDefault(require("color"));
const log = __importStar(require("@bldr/log"));
// See @bldr/themes/default-vars.scss
const colors = {
    'white-light': '#fcfcfb',
    'yellow-light': '#f0d171',
    'orange-light': '#f3a058',
    'red-light': '#e57174',
    'brown-light': '#ac8976',
    'gray-light': '#c4bcb8',
    'green-light': '#6eb464',
    'blue-light': '#658db7',
    'purple-light': '#bb8eae',
    'black-light': '#3a3331',
    white: '#fcfbfb',
    yellow: '#edc958',
    orange: '#f18f3b',
    red: '#e0585b',
    brown: '#9c755f',
    gray: '#bab0ac',
    green: '#59a14e',
    blue: '#4e79a7',
    purple: '#af7aa0',
    black: '#141110',
    'white-dark': '#d9d4d2',
    'yellow-dark': '#e8bb2c',
    'orange-dark': '#e71',
    'red-dark': '#d93134',
    'brown-dark': '#856351',
    'gray-dark': '#a2948f',
    'green-dark': '#4c8942',
    'blue-dark': '#42678e',
    'purple-dark': '#9e5f8c',
    'black-dark': '#110f0e'
};
function createGimpPaletteLine(color, name) {
    const segments = [];
    for (const rgb of color.color) {
        if (rgb > 99) {
            segments.push(`${rgb} `);
        }
        else if (rgb > 9) {
            segments.push(` ${rgb} `);
        }
        else {
            segments.push(`  ${rgb} `);
        }
    }
    segments.push(` ${name}`);
    return segments.join('');
}
/**
 * Palette for Inkscape
 *
 * ~/.config/inkscape/palettes/baldr.gpl
 * ```
 * GIMP Palette
 * Name: baldr
 * 252 251 251  white-light
 * 237 201  88  yellow-light
 * ```
 */
function createGimpPalette() {
    const lines = [];
    lines.push('GIMP Palette');
    lines.push('Name: baldr');
    for (const colorName in colors) {
        const color = new color_1.default(colors[colorName]);
        lines.push(createGimpPaletteLine(color.rgb(), colorName));
    }
    log.info(lines.join('\n'));
}
module.exports = createGimpPalette;
