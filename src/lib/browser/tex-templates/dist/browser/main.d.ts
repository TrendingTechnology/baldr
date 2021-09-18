interface KeyValuePairs {
    [key: string]: string;
}
export declare function cmd(name: string, content: string): string;
/**
 * For example `  key = { One, two, three },` or `  key = One,`
 */
export declare function keyValues(pairs: KeyValuePairs): string;
export declare function environment(name: string, content: string, pairs?: KeyValuePairs): string;
export {};
