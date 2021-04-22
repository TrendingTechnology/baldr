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
// Third party packages.
const chalk_1 = __importDefault(require("chalk"));
// Project packages.
const media_manager_1 = require("@bldr/media-manager");
const titles_1 = require("@bldr/titles");
function read(filePath) {
    console.log(filePath);
    const titles = new titles_1.DeepTitle(filePath);
    console.log(`  id: ${chalk_1.default.cyan(titles.id)}`);
    console.log(`  title: ${chalk_1.default.yellow(titles.title)}`);
    if (titles.subtitle == null)
        console.log(`  subtitle: ${chalk_1.default.green(titles.subtitle)}`);
    console.log(`  grade: ${chalk_1.default.blue(titles.grade)}`);
    console.log(`  curriculum: ${chalk_1.default.red(titles.curriculum)}\n`);
}
/**
 * List all hierarchical (deep) folder titles.
 *
 * @param {Array} filePaths - An array of input files, comes from the commanders’
 *   variadic parameter `[files...]`.
 */
function action(filePaths) {
    return __awaiter(this, void 0, void 0, function* () {
        yield media_manager_1.walk({
            presentation(relPath) {
                read(relPath);
            }
        }, {
            path: filePaths
        });
    });
}
module.exports = action;
