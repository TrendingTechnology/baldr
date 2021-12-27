declare type Replacements = [key: string, value: string][];
interface Options {
    customReplacements: Replacements;
}
export default function transliterate(string: string, options?: Options): string;
export {};
