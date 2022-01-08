/**
 * Normalize a presentation file.
 *
 * Remove unnecessary single quotes around media URIs.
 *
 * @param filePath - A path of a text file.
 */
export declare function normalizePresentationFile(filePath: string): void;
/**
 * Create a automatically generated presentation file.
 */
export declare function generateAutomaticPresentation(filePath?: string, force?: boolean): Promise<void>;
