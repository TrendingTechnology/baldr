"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CounterMaster = exports.formatCounterNumber = void 0;
const alphabet = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z'
];
/**
 * @see https://stackoverflow.com/a/41358305
 */
function convertToRoman(currentNumber) {
    const roman = {
        M: 1000,
        CM: 900,
        D: 500,
        CD: 400,
        C: 100,
        XC: 90,
        L: 50,
        XL: 40,
        X: 10,
        IX: 9,
        V: 5,
        IV: 4,
        I: 1
    };
    let output = '';
    for (var romanNumber of Object.keys(roman)) {
        var q = Math.floor(currentNumber / roman[romanNumber]);
        currentNumber -= q * roman[romanNumber];
        output += romanNumber.repeat(q);
    }
    return output;
}
/**
 * Format the current counter number.
 *
 * @param currentNumber - The current count number. The first number is `1` not `0`.
 * @param format - See the type definition.
 *
 * @returns If the current counter number is higher than 26, then the alphabet
 * is no longer used.
 */
function formatCounterNumber(currentNumber, format) {
    if (format === 'lower' || (format === 'upper' && currentNumber <= 26)) {
        const glyph = alphabet[currentNumber - 1];
        if (format === 'upper') {
            return glyph.toUpperCase();
        }
        return glyph;
    }
    if (format === 'roman') {
        return convertToRoman(currentNumber);
    }
    return `${currentNumber}`;
}
exports.formatCounterNumber = formatCounterNumber;
class CounterMaster {
    constructor() {
        this.name = 'counter';
        this.displayName = 'Zähler';
        this.icon = {
            name: 'counter',
            color: 'black',
            size: 'large',
            /**
             * U+1F522
             *
             * @see https://emojipedia.org/input-numbers/
             */
            unicodeSymbol: '🔢'
        };
        this.fieldsDefintion = {
            to: {
                type: Number,
                required: true,
                description: 'Zähle bis zu dieser Zahl. In arabischen Zahlen angeben.'
            },
            format: {
                default: 'arabic',
                description: 'In welchem Format aufgezählt werden soll: arabic (arabische Zahlen), lower (Kleinbuchstaben), upper (Großbuchstaben), roman (Römische Zahlen).'
            }
        };
    }
    normalizeFieldsInput(fields) {
        let to;
        let format;
        if (typeof fields === 'string') {
            to = parseInt(fields);
        }
        else if (typeof fields === 'number') {
            to = fields;
        }
        else {
            format = fields.format != null ? fields.format : undefined;
            to = fields.to != null ? fields.to : undefined;
        }
        if (format == null) {
            format = 'arabic';
        }
        if (to == null) {
            throw new Error('The master slide “counter” requires the field “to”!');
        }
        const counterElements = [];
        for (let index = 1; index <= to; index++) {
            counterElements.push(formatCounterNumber(index, format));
        }
        return {
            to,
            format
        };
    }
    collectFieldsOnInstantiation(fields) {
        const counterElements = [];
        for (let index = 1; index <= fields.to; index++) {
            counterElements.push(formatCounterNumber(index, fields.format));
        }
        return {
            to: fields.to,
            counterElements,
            format: fields.format
        };
    }
    collectStepsOnInstantiation(fields, stepCollection) {
        for (const counterElement of fields.counterElements) {
            stepCollection.add(`Zähle „${counterElement}“`);
        }
    }
}
exports.CounterMaster = CounterMaster;
