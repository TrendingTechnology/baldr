import { Master, StepCollector } from '../master';
declare type CounterRawInput = string | number | CounterInput;
interface CounterInput {
    to: number;
    format: Format;
}
interface CounterInstantiated extends CounterInput {
    counterElements: string[];
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
    normalizeFieldsInput(fields: CounterRawInput): CounterInput;
    collectFieldsOnInstantiation(fields: CounterInput): CounterInstantiated;
    collectStepsOnInstantiation(fields: CounterInstantiated, stepCollection: StepCollector): void;
}
export {};
