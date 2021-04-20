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

import { cloze } from './specs/cloze'
import { composition } from './specs/composition'
import { cover } from './specs/cover'
import { group } from './specs/group'
import { instrument } from './specs/instrument'
import { person } from './specs/person'
import { photo } from './specs/photo'
import { radio } from './specs/radio'
import { recording } from './specs/recording'
import { reference } from './specs/reference'
import { score } from './specs/score'
import { song } from './specs/song'
import { worksheet } from './specs/worksheet'
import { youtube } from './specs/youtube'
import { general } from './specs/_general'

export default {
  cloze,
  composition,
  cover,
  group,
  instrument,
  person,
  photo,
  radio,
  recording,
  reference,
  score,
  song,
  worksheet,
  youtube,
  // Applied to all
  general
}
