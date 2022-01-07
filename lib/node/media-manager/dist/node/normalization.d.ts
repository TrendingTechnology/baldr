/**
 * Execute different normalization tasks.
 *
 * @param filePaths - An array of input files, comes from the
 *   commanders’ variadic parameter `[files...]`.
 */
export declare function normalize(filePaths: string[], filter?: 'presentation' | 'tex' | 'asset'): Promise<void>;
