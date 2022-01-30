/**
 * ```
 * presentation = new Presentation() [presentation.ts]
 *   new SlideCollection() [slide-collection.ts]
 *     new Slide(..) [slide.ts]
 *       Master.initializeFields(..)
 *         master.normalizeFieldsInput(..)
 *         master.collectFieldsOnInstantiation(..)
 *       Master.processMediaUris(..)
 *       Master.processOptionalMediaUris(..)
 *       Master.collectStepsOnInstation(..)
 *
 * presentation.resolve()
 *   Master.finalizeSlide(..) [master.ts]
 *     master.collectFields(..)
 *     master.collectStepsLate(..)
 * ```
 *
 * The different states of the master slide field types.
 *
 * - `..FieldsRaw`
 * - `..Fields`
 *
 * - `..Data`
 *
 * Master slide “generic”:
 *
 * - `GenericFieldsRaw`
 * - `GenericFields`
 *
 * - `GenericData`
 *
 * `..FieldsRaw` ->
 * `master.normalizeFieldsInput(..)` -> (defaults) ->
 * `master.collectFieldsOnInstantiation(..)` ->
 * `..Fields` ->
 * `master.collectFieldsAfterResolution(..)` ->
 * `master.collectDataAfterResolution(..)` ->
 * `..Data`
 *
 * @module @bldr/presentation-parser
 */

import { Presentation } from './presentation'

export { resolver, Presentation } from './presentation'
export {
  mapStepFieldDefintionsToProps,
  FieldDefinition,
  FieldDefinitionCollection
} from './field'

export { Master } from './master-wrapper'
export { Slide } from './slide'

export { masterCollection, getMaster } from './master-collection'

// MModule = MasterModule
export * as editorMModul from './masters/editor'
export * as genericMModul from './masters/generic'
export * as interactiveGraphicMModule from './masters/interactive-graphic'
export * as personMModul from './masters/person'
export * as questionMModul from './masters/question'
export * as wikipediaMModule from './masters/wikipedia'
export * as youtubeMModule from './masters/youtube'

export { Asset, Sample } from '@bldr/media-resolver'

export { WrappedUri, WrappedUriList } from '@bldr/client-media-models'

export function parse (yamlString: string): Presentation {
  return new Presentation(yamlString)
}

export async function parseAndResolve (
  yamlString: string
): Promise<Presentation> {
  const presentation = new Presentation(yamlString)
  await presentation.resolve()
  return presentation
}
