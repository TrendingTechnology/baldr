import { Sample } from './sample';
import { ClientMediaAsset } from './asset';
export declare class Cache<T> {
    protected cache: {
        [ref: string]: T;
    };
    constructor();
    add(ref: string, mediaObject: T): boolean;
    get(ref: string): T | undefined;
    /**
     * The size of the cache. Indicates how many media objects are in the cache.
     */
    get size(): number;
    getAll(): T[];
    reset(): void;
    [Symbol.iterator](): Generator<T, any, any>;
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
export declare const mediaUriCache: MediaUriCache;
declare class SampleCache extends Cache<Sample> {
}
export declare const sampleCache: SampleCache;
export declare class AssetCache extends Cache<ClientMediaAsset> {
    add(ref: string, asset: ClientMediaAsset): boolean;
    get(uuidOrRef: string): ClientMediaAsset | undefined;
}
export declare const assetCache: AssetCache;
export declare function resetMediaCache(): void;
export {};
