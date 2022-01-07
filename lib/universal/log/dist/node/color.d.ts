export { red, green, yellow, blue, magenta, cyan } from 'chalk';
export declare type ColorName = 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'none';
export declare function getColorFunction(colorName: ColorName): (input: unknown) => string;
