"use strict";
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
// Third party packages.
const chalk_1 = __importDefault(require("chalk"));
// Project packages.
const media_manager_1 = require("@bldr/media-manager");
function renameByRegex(filePath, { pattern, replacement }) {
    const newFilePath = filePath.replace(pattern, replacement);
    if (filePath !== newFilePath) {
        console.log(`\nRename:\n  old: ${chalk_1.default.yellow(filePath)} \n  new: ${chalk_1.default.green(newFilePath)}`);
        fs_1.default.renameSync(filePath, newFilePath);
    }
}
function action(pattern, replacement, filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        yield media_manager_1.walk(renameByRegex, {
            regex: new RegExp('.*'),
            path: filePath,
            payload: { pattern, replacement }
        });
    });
}
module.exports = action;
