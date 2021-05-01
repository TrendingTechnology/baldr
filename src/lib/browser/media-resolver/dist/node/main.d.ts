import { ClientMediaAsset, AssetCache } from '@bldr/client-media-models';
export declare const httpRequest: import("@bldr/http-request").HttpRequest;
export declare const assetCache: AssetCache;
/**
 * Resolve (get the HTTP URL and some meta informations) of a remote media
 * file by its URI. Create media elements for each media file. Create samples
 * for playable media files.
 */
export declare class Resolver {
    /**
     * Assets with linked assets have to be cached. For example: many
     * audio assets can have the same cover ID.
     */
    private cache;
    constructor();
    /**
     * Query the media server to get meta informations and the location of the file.
     *
     * @param field - For example `id` or `uuid`
     * @param search - For example `Fuer-Elise_HB`
     * @param throwException - Throw an exception if the media URI
     *  cannot be resolved (default: `true`).
     */
    private queryMediaServer;
    /**
     * @private
     *
     * @param {String} uri - For example `uuid:... ref:...`
     * @param {Object} data - Object from the REST API.
     *
     * @returns {module:@bldr/media-client.ClientMediaAsset}
     */
    /**
     * Resolve (get the HTTP URL and some meta informations) of a remote media
     * file by its URI.
     */
    private resolveSingle;
    /**
     * Resolve one or more remote media files by URIs.
     *
     * Linked media URIs are resolved recursively.
     *
     * @param uris - A single media URI or an array of media URIs.
     */
    resolve(uris: string | string[] | Set<string>): Promise<ClientMediaAsset[]>;
}
