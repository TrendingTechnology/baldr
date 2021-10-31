import * as color from './color';
declare type ColorSpecification = color.ColorName[] | color.ColorName;
interface FormatOption {
    colors?: ColorSpecification;
}
export declare type FormatOptions = FormatOption | ColorSpecification;
export declare function format(template: string, args?: any[], options?: FormatOptions): string;
interface FormatObjectOption {
    indentation?: number;
    keys?: string[];
}
/**
 * Format a string indexed object.
 *
 * ```
 * ref:        Konzertkritik
 * uuid:       13fb6aa9-9c07-4b5c-a113-d259d9caad8d
 * title:      Interpreten und Interpretationen im Spiegel der Musikkritik
 * subtitle:   <em class="person">Ludwig van Beethoven</em>: <em class="piece">Klaviersonate f-Moll op. 57 „Appassionata“</em> (1807)
 * subject:    Musik
 * grade:      12
 * curriculum: Interpreten und Interpretationen / Konzertierende Musiker
 * ```
 *
 * @param object - A object with string properties.
 * @param options - Some options. See interface
 *
 * @returns A formatted string containing line breaks.
 */
export declare function formatObject(object: any, options?: FormatObjectOption): string;
export {};
