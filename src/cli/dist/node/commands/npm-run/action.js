"use strict";
// Node packages.
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
const path_1 = __importDefault(require("path"));
const child_process_1 = __importDefault(require("child_process"));
const log = __importStar(require("@bldr/log"));
const core_node_1 = require("@bldr/core-node");
/**
 * @param filePath - A file inside a javascript / node package.
 */
function action(scriptName, filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        filePath = path_1.default.resolve(filePath);
        const packageJson = core_node_1.findParentFile(path_1.default.resolve(filePath), 'package.json');
        if (packageJson == null) {
            log.info('No package.json found on %s.', [filePath]);
            throw Error('No package.json found.');
        }
        log.info('Found %s', [packageJson]);
        return yield new Promise(function (resolve, reject) {
            const parentDir = path_1.default.dirname(packageJson);
            const npm = child_process_1.default.spawn('npm', ['run', scriptName], {
                cwd: parentDir
            });
            npm.stdout.pipe(process.stdout);
            npm.stderr.pipe(process.stderr);
            npm.on('close', code => {
                if (code === 0) {
                    resolve();
                }
                else {
                    reject(new Error(log.format('The script % failed', [scriptName], 'none')));
                }
            });
        });
    });
}
module.exports = action;
