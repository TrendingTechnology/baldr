/**
 * Normalize a presentation file.
 *
 * Remove unnecessary single quotes around media URIs.
 *
 * @param filePath - A path of a text file.
 */
export declare function normalizePresentationFile(filePath: string): void;
/**
 * Create a Praesentation.baldr.yml file and insert all media assets in
 * the presentation.
 *
 * @param filePath - The file path of the new created presentation
 *   template.
 */
export declare function generatePresentation(filePath: string): Promise<void>;
