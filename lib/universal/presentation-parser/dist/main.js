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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Presentation } from './presentation';
export { resolver, Presentation } from './presentation';
export { mapStepFieldDefintionsToProps } from './field';
export { Master } from './master-wrapper';
export { Slide } from './slide';
export { masterCollection, getMaster } from './master-collection';
import * as editorMModul_1 from './masters/editor';
export { editorMModul_1 as editorMModul };
import * as genericMModul_1 from './masters/generic';
export { genericMModul_1 as genericMModul };
import * as interactiveGraphicMModule_1 from './masters/interactive-graphic';
export { interactiveGraphicMModule_1 as interactiveGraphicMModule };
import * as personMModul_1 from './masters/person';
export { personMModul_1 as personMModul };
import * as questionMModul_1 from './masters/question';
export { questionMModul_1 as questionMModul };
import * as wikipediaMModule_1 from './masters/wikipedia';
export { wikipediaMModule_1 as wikipediaMModule };
import * as youtubeMModule_1 from './masters/youtube';
export { youtubeMModule_1 as youtubeMModule };
export { Asset, Sample } from '@bldr/media-resolver';
export { WrappedUriList } from '@bldr/client-media-models';
export function parse(yamlString) {
    return new Presentation(yamlString);
}
export function parseAndResolve(yamlString) {
    return __awaiter(this, void 0, void 0, function* () {
        const presentation = new Presentation(yamlString);
        yield presentation.resolve();
        return presentation;
    });
}
