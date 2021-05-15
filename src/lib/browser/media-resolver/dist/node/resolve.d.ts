import { ClientMediaAsset, Sample } from './internal';
export declare const httpRequest: import("@bldr/http-request").HttpRequest;
/**
 * Resolve (get the HTTP URL and some meta informations) of a remote media
 * file by its URI. Create media elements for each media file. Create samples
 * for playable media files.
 */
declare class Resolver {
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
     * @param uri A media URI (Uniform Resource Identifier) with an optional
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
    resolve(uris: string | string[] | Set<string>, throwException?: boolean): Promise<ClientMediaAsset[]>;
    getAssets(): ClientMediaAsset[];
    getSamples(): Sample[];
}
export declare const resolver: Resolver;
/**
 * Resolve one or more remote media files by their URIs.
 *
 * Linked media URIs are resolved recursively.
 *
 * @param uris - A single media URI or an array of media URIs.
 */
export declare function resolve(uris: string | string[] | Set<string>): Promise<ClientMediaAsset[]>;
export {};
