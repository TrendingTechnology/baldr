import { Master } from '../master';
declare type CounterFieldsRaw = string | number | CounterFieldsNormalized;
interface CounterFieldsNormalized {
    to: number;
    format: Format;
}
/**
 * This formats are allowed:
 *
 * - arabic: 1, 2, 3, …
 * - lower: a, b, c, …
 * - upper: A, B, C, …
 */
export declare type Format = 'arabic' | 'lower' | 'upper' | 'roman';
/**
 * Format the current counter number.
 *
 * @param currentNumber - The current count number. The first number is `1` not `0`.
 * @param format - See the type definition.
 *
 * @returns If the current counter number is higher than 26, then the alphabet
 * is no longer used.
 */
export declare function formatCounterNumber(currentNumber: number, format: Format): string;
export declare class CounterMaster implements Master {
    name: string;
    displayName: string;
    icon: {
        name: string;
        color: string;
        size: "large";
    };
    fieldsDefintion: {
        to: {
            type: NumberConstructor;
            required: boolean;
            description: string;
        };
        format: {
            default: string;
            description: string;
        };
    };
    normalizeFields(fields: CounterFieldsRaw): CounterFieldsNormalized;
    collectFields(fields: CounterFieldsNormalized): {
        toFormatted: string;
    } & CounterFieldsNormalized;
}
export {};
