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
import type { MediaCategory } from '@bldr/type-definitions';
export declare const categories: MediaCategory.Collection;
/**
 * Remove all properties that can not represented in JSON. Remove absent
 * properties.
 *
 * @returns A object that can be converted to JSON.
 */
export declare function stripCategories(): object;
