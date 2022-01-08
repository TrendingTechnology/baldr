import chalk from 'chalk';
export declare const red: chalk.Chalk;
export declare const green: chalk.Chalk;
export declare const yellow: chalk.Chalk;
export declare const blue: chalk.Chalk;
export declare const magenta: chalk.Chalk;
export declare const cyan: chalk.Chalk;
export declare type ColorName = 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'none';
export declare function getColorFunction(colorName: ColorName): (input: unknown) => string;
