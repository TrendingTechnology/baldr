import { Sample } from './sample';
import { ClientMediaAsset } from './asset';
/**
 * Media assets have two URIs: uuid:... and ref:...
 */
export declare class MediaUriCache {
    private refs;
    private uuids;
    constructor();
    addPair(ref: string, uuid: string): boolean;
    private getRefFromUuid;
    getRef(uuidOrRef: string): string | undefined;
    reset(): void;
}
export declare class SampleCache {
    private cache;
    constructor();
    add(sample: Sample): boolean;
    getAll(): Sample[];
    reset(): void;
}
export declare const sampleCache: SampleCache;
export declare class AssetCache {
    private cache;
    private readonly mediaUriCache;
    constructor();
    add(asset: ClientMediaAsset): boolean;
    get(uuidOrRef: string): ClientMediaAsset | undefined;
    getAll(): ClientMediaAsset[];
    reset(): void;
}
export declare const assetCache: AssetCache;
export declare function resetMediaCache(): void;
