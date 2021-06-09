"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// Node packages.
const fs_1 = __importDefault(require("fs"));
// Project packages.
const media_manager_1 = require("@bldr/media-manager");
const yaml_1 = require("@bldr/yaml");
const log = __importStar(require("@bldr/log"));
function validateYamlOneFile(filePath) {
    try {
        yaml_1.convertFromYamlRaw(fs_1.default.readFileSync(filePath, 'utf8'));
        log.debug('%s: %s', log.colorize.green('ok'), filePath);
    }
    catch (error) {
        const e = error;
        log.error('%s: %s: %s', log.colorize.red('error'), e.name, e.message);
        throw new Error(error.name);
    }
}
/**
 * Create the metadata YAML files.
 *
 * @param filePaths - An array of input files, comes from the
 *   commanders’ variadic parameter `[files...]`.
 */
function action(filePaths, cmdObj) {
    return __awaiter(this, void 0, void 0, function* () {
        yield media_manager_1.walk({
            asset(relPath) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (!fs_1.default.existsSync(`${relPath}.yml`)) {
                        yield media_manager_1.operations.initializeMetaYaml(relPath);
                    }
                    else {
                        yield media_manager_1.operations.normalizeMediaAsset(relPath, cmdObj);
                    }
                });
            },
            everyFile(relPath) {
                if (relPath.match(/\.yml$/i) != null) {
                    validateYamlOneFile(relPath);
                }
            }
        }, {
            path: filePaths
        });
    });
}
module.exports = action;
