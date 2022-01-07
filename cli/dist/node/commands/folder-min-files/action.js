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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const log = __importStar(require("@bldr/log"));
const getAllFiles = function (dirPath, min = 20) {
    const files = fs_1.default.readdirSync(dirPath);
    if (files.length >= min) {
        console.log('\n' + log.colorize.red(dirPath));
        for (const file of files) {
            console.log('  - ' + file);
        }
    }
    for (const file of files) {
        const filePath = path_1.default.join(dirPath, file);
        if (fs_1.default.statSync(filePath).isDirectory()) {
            getAllFiles(filePath, min);
        }
    }
};
function action(filePath, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        let min = 20;
        if (opts.min != null) {
            min = parseInt(opts.min);
        }
        getAllFiles(filePath != null ? filePath : process.cwd(), min);
    });
}
module.exports = action;
