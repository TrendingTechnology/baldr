import { ApiTypes } from '@bldr/type-definitions';
/**
 * Throw an error if the media type is unkown. Provide a default value.
 *
 * @param mediaType - At the moment `asset` and `presentation`
 */
export declare function validateMediaType(mediaType: string): ApiTypes.MediaType;
/**
 * Resolve a ID from a given media type (`assets`, `presentations`) to a
 * absolute path.
 *
 * @param ref - The ref of the media type.
 * @param mediaType - At the moment `assets` and `presentation`
 */
export declare function getAbsPathFromRef(ref: string, mediaType?: ApiTypes.MediaType): Promise<string>;
