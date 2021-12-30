"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readMasterExamples = exports.getStylePaths = exports.createAliases = void 0;
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
exports.createAliases = createAliases;
function stylePath(themeName) {
    return path_1.default.join(path_1.default.dirname(require.resolve('@bldr/themes')), `${themeName}.scss`);
}
/**
 * ```js
 * pluginOptions: {
 *   'style-resources-loader': {
 *     preProcessor: 'scss',
 *     patterns: [
 *       '.../baldr/src/vue/plugins/themes/src/default.scss',
 *       '../baldr/src/vue/plugins/themes/src/handwriting.scss'
 *     ]
 *   }
 * }
 * ```
 */
function getStylePaths() {
    return [stylePath('default'), stylePath('handwriting')];
}
exports.getStylePaths = getStylePaths;
function readMasterExamples() {
    function getBaseName(filePath) {
        return filePath.replace('.baldr.yml', '');
    }
    const examples = {
        common: {},
        masters: {}
    };
    const basePath = path_1.default.join(require
        .resolve('@bldr/presentation-parser')
        .replace('/dist/node/main.js', ''), 'tests', 'files');
    // common
    const commonBasePath = path_1.default.join(basePath, 'common');
    for (const exampleFile of fs_1.default.readdirSync(commonBasePath)) {
        if (exampleFile.match(/\.baldr\.yml$/) != null) {
            const rawYaml = fs_1.default.readFileSync(path_1.default.join(commonBasePath, exampleFile), 'utf8');
            examples.common[getBaseName(exampleFile)] = rawYaml;
        }
    }
    // masters
    const mastersBasePath = path_1.default.join(basePath, 'masters');
    for (const masterName of fs_1.default.readdirSync(mastersBasePath)) {
        const rawYaml = fs_1.default.readFileSync(path_1.default.join(mastersBasePath, masterName), 'utf8');
        examples.masters[getBaseName(masterName)] = rawYaml;
    }
    return examples;
}
exports.readMasterExamples = readMasterExamples;
