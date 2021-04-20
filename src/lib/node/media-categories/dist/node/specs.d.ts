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
import { MediaCategory } from '@bldr/type-definitions';
declare const _default: {
    cloze: MediaCategory.Category;
    composition: MediaCategory.Category;
    cover: MediaCategory.Category;
    group: MediaCategory.Category;
    instrument: MediaCategory.Category;
    person: MediaCategory.Category;
    photo: MediaCategory.Category;
    radio: MediaCategory.Category;
    recording: MediaCategory.Category;
    reference: MediaCategory.Category;
    score: MediaCategory.Category;
    song: MediaCategory.Category;
    worksheet: MediaCategory.Category;
    youtube: MediaCategory.Category;
    general: MediaCategory.Category;
};
export default _default;
