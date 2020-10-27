var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Third party packages.
const chalk = require('chalk');
// Project packages.
const mediaManager = require('@bldr/media-manager');
const mediaServer = require('@bldr/media-server');
function read(filePath) {
    console.log(filePath);
    const titles = new mediaManager.default.DeepTitle(filePath);
    console.log(`  id: ${chalk.cyan(titles.id)}`);
    console.log(`  title: ${chalk.yellow(titles.title)}`);
    if (titles.subtitle)
        console.log(`  subtitle: ${chalk.green(titles.subtitle)}`);
    console.log(`  grade: ${chalk.blue(titles.grade)}`);
    console.log(`  curriculum: ${chalk.red(titles.curriculum)}\n`);
}
/**
 *
 * @param {Array} files - An array of input files, comes from the commanders’
 *   variadic parameter `[files...]`.
 */
function action(files) {
    return __awaiter(this, void 0, void 0, function* () {
        yield mediaServer.walk({
            presentation(relPath) {
                read(relPath);
            }
        }, {
            path: files
        });
    });
}
module.exports = action;
