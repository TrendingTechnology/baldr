import { UriTranslator, Cache } from './cache';
import { Sample, Asset } from './types';
declare type UrisSpec = string | string[] | Set<string>;
declare class SampleCache extends Cache<Sample> {
    uriTranslator: UriTranslator;
    constructor(translator: UriTranslator);
    get(uuidOrRef: string): Sample | undefined;
}
declare class AssetCache extends Cache<Asset> {
    uriTranslator: UriTranslator;
    constructor(translator: UriTranslator);
    add(ref: string, asset: Asset): boolean;
    get(uuidOrRef: string): Asset | undefined;
}
/**
 * Resolve (get the HTTP URL and some meta informations) of a remote media
 * file by its URI. Create media elements for each media file. Create samples
 * for playable media files.
 */
export declare class Resolver {
    httpRequest: import("@bldr/http-request").HttpRequest;
    sampleCache: SampleCache;
    assetCache: AssetCache;
    uriTranslator: UriTranslator;
    /**
     * Assets with linked assets have to be cached. For example: many
     * audio assets can have the same cover ID.
     */
    private cache;
    constructor();
    /**
     * Query the media server to get meta informations and the location of the file.
     *
     * @param uri - For example `ref:Fuer-Elise`
     * @param throwException - Throw an exception if the media URI
     *  cannot be resolved (default: `true`).
     */
    private queryMediaServer;
    /**
     * Resolve (get the HTTP URL and some meta informations) of a remote media
     * file by its URI.
     *
     * @param uri - A media URI (Uniform Resource Identifier) with an optional
     *   fragment suffix, for example `ref:Yesterday#complete`. The fragment
     *   suffix is removed.
     * @param throwException - Throw an exception if the media URI
     *  cannot be resolved (default: `true`).
     */
    private resolveSingle;
    /**
     * Resolve one or more remote media files by URIs.
     *
     * Linked media URIs are resolved recursively.
     *
     * @param uris - A single media URI or an array of media URIs.
     * @param throwException - Throw an exception if the media URI
     *  cannot be resolved (default: `true`).
     */
    resolve(uris: UrisSpec, throwException?: boolean): Promise<Asset[]>;
    /**
     * Return a media asset. If the asset has not yet been resolved, it will be
     * resolved.
     *
     * @param uri - A media URI in the `ref` or `uuid` scheme with or without a
     * sample fragment.
     *
     * @returns A media asset or undefined.
     */
    getAsset(uri: string): Promise<Asset | undefined>;
    /**
     * Return a sample. If the sample has not yet been resolved, it will be
     * resolved.
     *
     * @param uri - A media URI in the `ref` or `uuid` scheme with or without a
     *   sample fragment. If the fragment is omitted, the “complete” sample is
     *   returned
     *
     * @returns A sample or undefined.
     */
    getSample(uri: string): Promise<Sample | undefined>;
    /**
     * @param uri - A asset URI in various formats.
     *
     * @returns A asset URI (without the fragment) in the `ref` scheme.
     */
    translateToAssetRef(uri: string): string | undefined;
}
export {};
