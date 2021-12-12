interface MediaData {
    relPath: string;
    [property: string]: any;
}
interface AssetData extends MediaData {
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
}
export declare function readAssetFile(filePath: string): AssetData;
export {};
