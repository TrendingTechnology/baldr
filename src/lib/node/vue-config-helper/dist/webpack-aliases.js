"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchForAliases = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
/**
 * To void conflicting vue imports which causes
 * strange errors: “$attrs is readonly”,“$listeners is readonly”
 * https://forum.vuejs.org/t/bootstrapvue-table-attrs-is-readonly-listeners-is-readonly/73143/2
 *
 * ```js
 * module.exports = {
 *   configureWebpack: {
 *     resolve: {
 *       alias: createAliases(['vue'], __dirname)
 *     }
 *   }
 * }
 * ```
 *
 * ```js
 * configureWebpack: {
 *   resolve: {
 *     alias: {
 *        vue$: path.resolve(
 *         __dirname,
 *         'node_modules/vue/dist/vue.runtime.esm.js'
 *       )
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
/**
 * Search for packages that can be used as aliases in the webpack configuration.
 *
 * @param dirname - Directory path of a package. The package must have
 *   a `node_modules` subfolder.
 */
function searchForAliases(dirname) {
    const nodeModulesDir = path_1.default.join(dirname, 'node_modules');
    // baldr: To avoid duplicates in the webpack builds
    const baldrDir = path_1.default.join(nodeModulesDir, '@bldr');
    const packageNames = [];
    if (fs_1.default.existsSync(baldrDir)) {
        for (const baldrPackageName of fs_1.default.readdirSync(baldrDir)) {
            packageNames.push(path_1.default.join('@bldr', baldrPackageName));
        }
    }
    // vue: To avoid conflicting imports
    const vuePackages = [
        'vue',
        'vuex',
        'vue-router',
        'vue-class-component',
        'vue-property-decorator'
    ];
    for (const vuePackage of vuePackages) {
        if (fs_1.default.existsSync(path_1.default.join(nodeModulesDir, vuePackage))) {
            packageNames.push(vuePackage);
        }
    }
    return createAliases(packageNames, dirname);
}
exports.searchForAliases = searchForAliases;
