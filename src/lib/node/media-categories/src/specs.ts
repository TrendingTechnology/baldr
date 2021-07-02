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

import type { MediaCategoriesTypes } from '@bldr/type-definitions'
import { deepCopy } from '@bldr/core-browser'

import { cloze } from './specs/cloze'
import { composition } from './specs/composition'
import { cover } from './specs/cover'
import { documentation } from './specs/documentation'
import { excerpt } from './specs/excerpt'
import { famousPiece } from './specs/famousPiece'
import { general } from './specs/_general'
import { group } from './specs/group'
import { instrument } from './specs/instrument'
import { person } from './specs/person'
import { photo } from './specs/photo'
import { radio } from './specs/radio'
import { recording } from './specs/recording'
import { reference } from './specs/reference'
import { sample } from './specs/sample'
import { score } from './specs/score'
import { song } from './specs/song'
import { videoClip } from './specs/videoClip'
import { worksheet } from './specs/worksheet'
import { youtube } from './specs/youtube'

export const categories: MediaCategoriesTypes.Collection = {
  cloze,
  composition,
  cover,
  documentation,
  excerpt,
  famousPiece,
  group,
  instrument,
  person,
  photo,
  radio,
  recording,
  reference,
  score,
  sample,
  song,
  videoClip,
  worksheet,
  youtube,
  // Applied to all
  general
}

/**
 * Remove all properties that can not represented in JSON. Remove absent
 * properties.
 *
 * @returns A object that can be converted to JSON.
 */
export function stripCategories (): object {
  // { [category: string]: MediaCategoriesTypes.Category }
  const cats = deepCopy(categories) as any
  for (const name in cats) {
    delete cats[name].detectCategoryByPath
    const category = cats[name]
    for (const propName in category.props) {
      if (category.props[propName].wikidata != null) {
        category.props[propName].wikidata = true
      }
      delete category.props[propName].removeByRegexp

      if (category.props[propName].state === 'absent') {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete category.props[propName]
      }
    }
  }
  return cats
}
