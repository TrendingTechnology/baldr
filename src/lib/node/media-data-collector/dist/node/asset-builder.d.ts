import { MediaDataTypes } from '@bldr/type-definitions';
import { Builder } from './builder';
/**
 * This class is used both for the entries in the MongoDB database as well for
 * the queries.
 */
export declare class AssetBuilder extends Builder {
    data: Partial<MediaDataTypes.AssetMetaData>;
    /**
     * @param filePath - The file path of the media file.
     */
    constructor(filePath: string);
    detectPreview(): AssetBuilder;
    detectWaveform(): AssetBuilder;
    /**
     * Search for mutlipart assets. The naming scheme of multipart assets is:
     * `filename.jpg`, `filename_no002.jpg`, `filename_no003.jpg`
     */
    detectMultiparts(): AssetBuilder;
    detectMimeType(): AssetBuilder;
    buildMinimal(): MediaDataTypes.MinimalAssetMetaData;
    buildForDb(): MediaDataTypes.AssetMetaData;
}
