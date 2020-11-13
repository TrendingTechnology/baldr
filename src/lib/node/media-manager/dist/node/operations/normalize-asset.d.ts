interface NormalizeMediaAssetOption {
    wikidata: boolean;
}
/**
 * @param filePath - The media asset file path.
 */
export declare function normalizeMediaAsset(filePath: string, options?: NormalizeMediaAssetOption): Promise<void>;
export {};
