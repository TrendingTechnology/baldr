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
import { MetaSpec } from '@bldr/type-definitions';
declare const _default: {
    cloze: MetaSpec.Type;
    composition: MetaSpec.Type;
    cover: MetaSpec.Type;
    group: MetaSpec.Type;
    instrument: MetaSpec.Type;
    person: MetaSpec.Type;
    photo: MetaSpec.Type;
    radio: MetaSpec.Type;
    recording: MetaSpec.Type;
    reference: MetaSpec.Type;
    score: MetaSpec.Type;
    song: MetaSpec.Type;
    worksheet: MetaSpec.Type;
    youtube: MetaSpec.Type;
    general: MetaSpec.Type;
};
export default _default;
