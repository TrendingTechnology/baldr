import { Sample } from './sample';
import { ClientMediaAsset } from './asset';
declare class Cache<T> {
    private cache;
    constructor();
    add(ref: string, mediaObject: T): boolean;
    get(ref: string): T | undefined;
    /**
     * The size of the cache. Indicates how many media objects are in the cache.
     */
    get size(): number;
    getAll(): T[];
    reset(): void;
}
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
declare class SampleCache extends Cache<Sample> {
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
export {};
