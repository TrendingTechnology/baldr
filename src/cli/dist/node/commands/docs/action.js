var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Node packages.
const path = require('path');
// Third party packages.
const chalk = require('chalk');
const fs = require('fs-extra');
const glob = require('glob');
const jsdoc = require('jsdoc-api');
// Project packages.
const { openWith } = require('@bldr/media-server');
const { CommandRunner } = require('@bldr/cli-utils');
const config = require('@bldr/config');
function open() {
    openWith('xdg-open', path.join(config.doc.dest, 'index.html'));
}
function generateDocs() {
    return __awaiter(this, void 0, void 0, function* () {
        const cmd = new CommandRunner();
        cmd.startSpin();
        cmd.log(`Update source: ${chalk.yellow(config.doc.src)}`);
        yield cmd.exec(['git', 'pull'], { cwd: config.doc.src });
        cmd.log(`Clean destination: ${chalk.green(config.doc.dest)}`);
        yield fs.remove(config.doc.dest);
        const docFiles = glob.sync(`${config.doc.src}/**/*.@(js|vue)`, {
            ignore: [
                '**/node_modules/**',
                '**/test/**',
                '**/tests/**'
            ]
        });
        cmd.log(`Generate documentation of ${docFiles.length} files.`);
        jsdoc.renderSync({
            files: docFiles,
            pedantic: true,
            readme: path.join(config.doc.src, 'README.md'),
            configure: config.doc.configFile,
            destination: config.doc.dest
        });
        open();
        cmd.stopSpin();
    });
}
function action(action) {
    if (action === 'open' || action === 'o') {
        open();
    }
    else if (action === 'generate' || action === 'g') {
        generateDocs();
    }
    else {
        console.log('Subcommands: open|o, generate|g');
    }
}
module.exports = action;
