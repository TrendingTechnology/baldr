"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAliases = void 0;
const path_1 = __importDefault(require("path"));
/**
 * To void conflicting vue imports which causes
 * strange errors: “$attrs is readonly”,“$listeners is readonly”
 * https://forum.vuejs.org/t/bootstrapvue-table-attrs-is-readonly-listeners-is-readonly/73143/2

 * ```js
 * configureWebpack: {
 *   resolve: {
 *     alias: {
 *        vue$: path.resolve(
 *         __dirname,
 *         'node_modules/vue/dist/vue.runtime.esm.js'
 *       ),
 *     }
 *   }
 * }
 * ```
 */
function createAliases(packageNames, dirname) {
    const aliases = {};
    for (const packageName of packageNames) {
        aliases[packageName + '$'] = path_1.default.resolve(dirname, 'node_modules', packageName);
    }
    return aliases;
}
exports.createAliases = createAliases;
