import { Builder, MediaData } from './builder';
export interface MinimalAssetData extends Omit<MediaData, 'relPath'> {
}
interface AssetDataRaw extends MediaData {
    /**
     * Indicates whether the media asset has a preview image (`_preview.jpg`).
     */
    hasPreview?: boolean;
    /**
     * Indicates wheter the media asset has a waveform image (`_waveform.png`).
     */
    hasWaveform?: boolean;
    /**
     * The number of parts of a multipart media asset.
     */
    multiPartCount?: number;
    mimeType?: string;
}
export interface DbAssetData extends AssetDataRaw {
    /**
     * A reference string, for example `Haydn_Joseph`.
     */
    ref: string;
    uuid: string;
    title: string;
}
/**
 * This class is used both for the entries in the MongoDB database as well for
 * the queries.
 */
export declare class AssetBuilder extends Builder {
    data: AssetDataRaw;
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
    buildMinimal(): MinimalAssetData;
    buildForDb(): DbAssetData;
}
export {};
