import { ClientMediaAsset } from '@bldr/client-media-models';
export declare const httpRequest: import("@bldr/http-request").HttpRequest;
/**
 * A `assetSpec` can be:
 *
 * 1. A remote URI (Uniform Resource Identifier) as a string, for example
 *    `id:Joseph_haydn` which has to be resolved.
 * 2. A already resolved HTTP URL, for example
 *    `https://example.com/Josef_Haydn.jg`
 * 3. A file object {@link https://developer.mozilla.org/de/docs/Web/API/File}
 *
 * @typedef assetSpec
 * @type {(String|File)}
 */
/**
 * An array of `assetSpec` or a single `assetSpec`
 *
 * @typedef assetSpecs
 * @type {(assetSpec[]|assetSpec)}
 */
/**
 * Resolve (get the HTTP URL and some meta informations) of a remote media
 * file by its URI. Resolve a local file. The local files have to dropped
 * in the application. Create media elements for each media file. Create samples
 * for playable media files.
 */
export declare class Resolver {
    /**
     * Assets with linked assets have to be cached. For example: many
     * audio assets can have the same cover ID.
     */
    private cache_;
    /**
     * Store for linked URIs (URIs inside media assets). They are collected
     * and resolved in a second step after the resolution of the main
     * media assets.
     */
    private readonly linkedUris;
    constructor();
    /**
     * @param field - For example `id` or `uuid`
     * @param search - For example `Fuer-Elise_HB`
     * @param throwException - Throw an exception if the media URI
     *  cannot be resolved (default: `true`).
     *
     * @returns {Object} - See {@link https://github.com/axios/axios#response-schema}
     */
    private queryMediaServer;
    /**
     * Create samples for each playable media file. By default each media file
     * has one sample called “complete”.
     *
     * @param {module:@bldr/media-client.ClientMediaAsset} asset - The
     *   `asset` object, a client side representation of a media asset.
     *
     * @returns {module:@bldr/media-client~Sample[]}
     */
    /**
     * @private
     *
     * @param {String} uri - For example `uuid:... id:...`
     * @param {Object} data - Object from the REST API.
     *
     * @returns {module:@bldr/media-client.ClientMediaAsset}
     */
    /**
     * @private
     *
     * @param {Object} file - A file object, see
     *  {@link https://developer.mozilla.org/de/docs/Web/API/File}
     *
     * @returns {module:@bldr/media-client.ClientMediaAsset}
     */
    /**
     * @param {module:@bldr/media-client.ClientMediaAsset} asset
     */
    /**
     * Resolve (get the HTTP URL and some meta informations) of a remote media
     * file by its URI.
     */
    private resolveSingle;
    /**
     * Resolve one or more remote media files by URIs, HTTP URLs or
     * local media files by their file objects.
     *
     * Linked media URIs are resolve in a second step (not recursive). Linked
     * media assets are not allowed to have linked media URIs.
     *
     * @param uris - A single media URI or an array of media URIs.
     */
    resolve(uris: string | string[]): Promise<ClientMediaAsset[]>;
}
