/**
 * ```
 * presentation = new Presentation() [presentation.ts]
 *   new SlideCollection() [slide-collection.ts]
 *     new Slide(..) [slide.ts]
 *       masterWrapper.initializeFields(..)
 *         master.normalizeFieldsInput(..)
 *         master.collectFieldsOnInstantiation(..)
 *       masterWrapper.processMediaUris(..)
 *       masterWrapper.processOptionalMediaUris(..)
 *       masterWrapper.collectStepsOnInstation(..)
 *
 * presentation.resolve()
 *   masterWrapper.finalizeSlide(..) [master.ts]
 *     master.collectFields(..)
 *     master.collectStepsLate(..)
 * ```
 *
 * The different states of the master slide field types.
 *
 * - `..FieldsRawInput`
 * - `..FieldsInput`
 * - `..FieldsInstantiated`
 * - `..FieldsFinal`
 *
 * Master slide “generic”:
 *
 * - `GenericFieldsRawInput`
 * - `GenericFieldsInput`
 * - `GenericFieldsInstantiated`
 * - `GenericFieldsFinal`
 *
 * `..FieldsRawInput` ->
 * `master.normalizeFieldsInput(..)` -> (defaults) ->
 * `..FieldsInput` ->
 * `master.collectFieldsOnInstantiation(..)` ->
 * `..FieldsInstantiated` ->
 * `master.collectFieldsAfterResolution(..)` ->
 * `..FieldsFinal`
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
export { mapStepFieldDefintionsToProps } from './master';
export { Slide } from './slide';
import * as genericMModul_1 from './masters/generic';
export { genericMModul_1 as genericMModul };
import * as questionMModul_1 from './masters/question';
export { questionMModul_1 as questionMModul };
import * as wikipediaMModule_1 from './masters/wikipedia';
export { wikipediaMModule_1 as wikipediaMModule };
import * as youtubeMModule_1 from './masters/youtube';
export { youtubeMModule_1 as youtubeMModule };
export { Asset, Sample } from '@bldr/media-resolver-ng';
export { WrappedUriList } from './fuzzy-uri';
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
