/**
 * This module contains the specification of the meta data categories.
 *
 * A media asset can be attached to multiple meta data categories (for example:
 * `categories: recording,composition`). All meta data categories belong to the
 * category `general`.
 *
 * Some meta data type properties can be enriched by using
 * {@link module:@bldr/wikidata wikidata}.
 */
import { MediaCategoriesTypes } from '@bldr/type-definitions';
export declare const categories: MediaCategoriesTypes.Collection;
/**
 * Remove all properties that can not represented in JSON. Remove absent
 * properties.
 *
 * @returns A object that can be converted to JSON.
 */
export declare function stripCategories(): object;
