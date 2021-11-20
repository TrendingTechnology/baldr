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
const path_1 = __importDefault(require("path"));
const child_process_1 = __importDefault(require("child_process"));
// Third party packages.
const chalk_1 = __importDefault(require("chalk"));
// Project packages.
const media_manager_1 = require("@bldr/media-manager");
const log = __importStar(require("@bldr/log"));
function buildOneFile(filePath) {
    const process = child_process_1.default.spawnSync('lualatex', ['--halt-on-error', '--shell-escape', filePath], { cwd: path_1.default.dirname(filePath) });
    if (process.status === 0) {
        log.info(chalk_1.default.green('OK') + ' ' + filePath);
    }
    else {
        log.info(chalk_1.default.red('ERROR') + ' ' + filePath);
    }
}
/**
 * Build TeX files.
 *
 * @param filePaths - An array of input files, comes from the commanders’
 *   variadic parameter `[files...]`
 */
function action(filePaths) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, media_manager_1.walk)(buildOneFile, {
            path: filePaths,
            regex: 'tex'
        });
    });
}
module.exports = action;
