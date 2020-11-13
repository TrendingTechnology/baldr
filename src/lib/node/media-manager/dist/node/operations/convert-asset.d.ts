/**
 * Convert a media asset file.
 *
 * @param filePath - The path of the input file.
 * @param cmdObj - The command object from the commander.
 *
 * @returns The output file path.
 */
export declare function convertAsset(filePath: string, cmdObj?: {
    [key: string]: any;
}): Promise<string | undefined>;
