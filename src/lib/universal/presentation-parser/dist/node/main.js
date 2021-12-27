"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAndResolve = exports.parse = exports.Sample = exports.Asset = exports.youtubeMModule = exports.wikipediaMModule = exports.questionMModul = exports.genericMModul = exports.mapStepFieldDefintionsToProps = exports.resolver = void 0;
const presentation_1 = require("./presentation");
var presentation_2 = require("./presentation");
Object.defineProperty(exports, "resolver", { enumerable: true, get: function () { return presentation_2.resolver; } });
var master_1 = require("./master");
Object.defineProperty(exports, "mapStepFieldDefintionsToProps", { enumerable: true, get: function () { return master_1.mapStepFieldDefintionsToProps; } });
// MModule = MasterModule
exports.genericMModul = require("./masters/generic");
exports.questionMModul = require("./masters/question");
exports.wikipediaMModule = require("./masters/wikipedia");
exports.youtubeMModule = require("./masters/youtube");
var media_resolver_ng_1 = require("@bldr/media-resolver-ng");
Object.defineProperty(exports, "Asset", { enumerable: true, get: function () { return media_resolver_ng_1.Asset; } });
Object.defineProperty(exports, "Sample", { enumerable: true, get: function () { return media_resolver_ng_1.Sample; } });
function parse(yamlString) {
    return new presentation_1.Presentation(yamlString);
}
exports.parse = parse;
function parseAndResolve(yamlString) {
    return __awaiter(this, void 0, void 0, function* () {
        const presentation = new presentation_1.Presentation(yamlString);
        yield presentation.resolve();
        return presentation;
    });
}
exports.parseAndResolve = parseAndResolve;
