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
Object.defineProperty(exports, "__esModule", { value: true });
// Node packages.
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Third party packages.
const chalk_1 = __importDefault(require("chalk"));
// Project packages.
const media_manager_1 = require("@bldr/media-manager");
/**
 * @param filePath - A file path.
 * @param cmdObj - An object containing options as key-value pairs.
 *  This parameter comes from `commander.Command.opts()`
*/
function action(filePath, cmdObj) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!filePath) {
            filePath = process.cwd();
        }
        else {
            const stat = fs_1.default.statSync(filePath);
            if (!stat.isDirectory()) {
                filePath = path_1.default.dirname(filePath);
            }
        }
        filePath = media_manager_1.locationIndicator.getPresParentDir(filePath);
        filePath = path_1.default.resolve(path_1.default.join(filePath, 'Praesentation.baldr.yml'));
        console.log(filePath);
        if (!fs_1.default.existsSync(filePath) || (cmdObj && cmdObj.force)) {
            console.log(`Presentation template created at: ${chalk_1.default.green(filePath)}`);
        }
        else {
            filePath = filePath.replace('.baldr.yml', '_tmp.baldr.yml');
            console.log(`Presentation already exists, create tmp file: ${chalk_1.default.red(filePath)}`);
        }
        yield media_manager_1.operations.generatePresentation(filePath);
    });
}
module.exports = action;
