#! /usr/bin/env node
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
exports.validateDefintion = exports.collectAllOpts = void 0;
// Node packages.
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Third party packages.
const commander_1 = require("commander");
// Project packages.
const core_node_1 = require("@bldr/core-node");
const log_1 = require("@bldr/log");
log_1.setLogLevel(3);
// Globals.
const commandsPath = path_1.default.join(__dirname, 'commands');
/**
 * To avoid duplicate aliases. The `commander` doesn’t complain about
 * duplicates.
 */
const aliases = [];
function increaseVerbosity(dummyValue, previous) {
    return previous + 1;
}
const program = new commander_1.Command();
program.option('-v, --verbose', 'Be more verbose', increaseVerbosity, 2);
program.on('command:*', function () {
    console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
    process.exit(1);
});
/**
 * We use a closure to be able te require the subcommands ad hoc on invocation.
 * To avoid long loading times by many subcommands.
 *
 * @param commandName - The name of the command.
 * @param def
 */
function actionHandler(commandName, def) {
    return function (...args) {
        if (def.checkExecutable != null) {
            core_node_1.checkExecutables(def.checkExecutable);
        }
        // eslint-disable-next-line
        const action = require(path_1.default.join(commandsPath, commandName, 'action.js'));
        args = [...arguments, program.opts()];
        // To be able to export some functions other than
        // the action function from the subcommands.
        if (typeof action === 'function')
            return action(...args);
        return action.action(...args);
    };
}
/**
 * Load all (sub)commands.
 *
 * @param program - An instance of the package “commander”.
 */
function loadCommands(program) {
    const subcommandDirs = fs_1.default.readdirSync(commandsPath);
    for (const commandName of subcommandDirs) {
        // eslint-disable-next-line
        const def = require(path_1.default.join(commandsPath, commandName, 'def.js'));
        const subProgramm = program.command(def.command);
        if (def.alias != null) {
            if (!aliases.includes(def.alias)) {
                subProgramm.alias(def.alias);
                aliases.push(def.alias);
            }
            else {
                throw new Error(`Duplicate alias “${def.alias}” used for the (sub)command “${def.command}”.`);
            }
        }
        subProgramm.description(def.description);
        if (def.options != null) {
            for (const option of def.options) {
                subProgramm.option(option[0], option[1]);
            }
        }
        subProgramm.action(actionHandler(commandName, def));
    }
}
function actionHelp() {
    console.log('Specify a subcommand.');
    program.outputHelp();
    process.exit(1);
}
/**
 * Collect all options. This is a temporary hack function.
 *
 * https://github.com/tj/commander.js/pull/1478
 * https://github.com/tj/commander.js/pull/1475
 *
 * ```js
 * import { collectAllOpts } from '../../main'
 *
 * function action (cmdObj: CmdObj, program: any): void {
 *   collectAllOpts(program)
 * }
 * ```
 *
 * @returns An object with all options
 */
function collectAllOpts(program) {
    const result = {};
    Object.assign(result, program.opts());
    for (let parentCmd = program.parent; parentCmd != null; parentCmd = parentCmd.parent) {
        Object.assign(result, parentCmd.opts());
    }
    return result;
}
exports.collectAllOpts = collectAllOpts;
function validateDefintion(spec) {
    return spec;
}
exports.validateDefintion = validateDefintion;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        loadCommands(program);
        try {
            yield program.parseAsync(process.argv);
        }
        catch (error) {
            console.log(error);
        }
        // [
        //  '/usr/local/bin/node',
        //  '/home/jf/.npm-packages/bin/baldr-media-server-cli'
        // ]
        if (process.argv.length <= 2) {
            actionHelp();
        }
    });
}
if (require.main === module) {
    main()
        .then()
        .catch(reason => console.log(reason));
}
