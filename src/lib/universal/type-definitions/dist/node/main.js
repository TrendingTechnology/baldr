"use strict";
/**
 * Some basic Typescript interfaces and type defintions.
 *
 * @module @bldr/type-definitions
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TitlesTypes = exports.MediaResolverTypes = exports.MediaCategoriesTypes = exports.LampTypes = exports.IconFontGeneratorTypes = exports.CliTypes = exports.ClientMediaModelsTypes = exports.ApiTypes = void 0;
__exportStar(require("./config"), exports);
/**
 * Types from specific packages.
 *
 * Naming convention: Title case package name + `Types`
 *
 * for example @bldr/titles -> TitlesTypes
 */
exports.ApiTypes = require("./api");
exports.ClientMediaModelsTypes = require("./client-media-models");
exports.CliTypes = require("./cli");
exports.IconFontGeneratorTypes = require("./icon-font-generator");
exports.LampTypes = require("./lamp");
exports.MediaCategoriesTypes = require("./media-categories");
exports.MediaResolverTypes = require("./media-resolver");
exports.TitlesTypes = require("./titles");
