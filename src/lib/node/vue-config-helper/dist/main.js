"use strict";
/**
 * Helper functions to build the configuration file `vue.config.js`
 *
 * @module @bldr/vue-config-helper
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.assembleVueConfigs = exports.buildDefinePluginConfig = exports.searchForAliases = exports.buildStyleResourcesLoaderConfig = exports.readMasterExamples = void 0;
var master_examples_1 = require("./master-examples");
Object.defineProperty(exports, "readMasterExamples", { enumerable: true, get: function () { return master_examples_1.readMasterExamples; } });
var style_resources_loader_1 = require("./style-resources-loader");
Object.defineProperty(exports, "buildStyleResourcesLoaderConfig", { enumerable: true, get: function () { return style_resources_loader_1.buildStyleResourcesLoaderConfig; } });
var webpack_aliases_1 = require("./webpack-aliases");
Object.defineProperty(exports, "searchForAliases", { enumerable: true, get: function () { return webpack_aliases_1.searchForAliases; } });
var define_plugin_1 = require("./define-plugin");
Object.defineProperty(exports, "buildDefinePluginConfig", { enumerable: true, get: function () { return define_plugin_1.buildDefinePluginConfig; } });
var all_1 = require("./all");
Object.defineProperty(exports, "assembleVueConfigs", { enumerable: true, get: function () { return all_1.assembleVueConfigs; } });
