/**
 * This module contains the specification of the meta data types.
 *
 * A media asset can be attached to multiple meta data types (for example:
 * `meta_types: recording,composition`). All meta data types belong to the type
 * `general`.
 *
 * The corresponding module is called
 * {@link module:@bldr/media-server/meta-types}
 *
 * Some meta data type properties can be enriched by using
 * {@link module:@bldr/wikidata wikidata}.
 *
 * @module @bldr/media-manager/meta-type-specs
 */
declare const _default: {
    cloze: import("@bldr/type-definitions/dist/node/media-category").Category;
    composition: import("@bldr/type-definitions/dist/node/media-category").Category;
    cover: import("@bldr/type-definitions/dist/node/media-category").Category;
    group: import("@bldr/type-definitions/dist/node/media-category").Category;
    instrument: import("@bldr/type-definitions/dist/node/media-category").Category;
    person: import("@bldr/type-definitions/dist/node/media-category").Category;
    photo: import("@bldr/type-definitions/dist/node/media-category").Category;
    radio: import("@bldr/type-definitions/dist/node/media-category").Category;
    recording: import("@bldr/type-definitions/dist/node/media-category").Category;
    reference: import("@bldr/type-definitions/dist/node/media-category").Category;
    score: import("@bldr/type-definitions/dist/node/media-category").Category;
    song: import("@bldr/type-definitions/dist/node/media-category").Category;
    worksheet: import("@bldr/type-definitions/dist/node/media-category").Category;
    youtube: import("@bldr/type-definitions/dist/node/media-category").Category;
    general: import("@bldr/type-definitions/dist/node/media-category").Category;
};
export default _default;
