#! /usr/bin/env node
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDefintion = exports.collectAllOpts = void 0;
// Node packages.
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Third party packages.
const commander_1 = require("commander");
// Project packages.
const core_node_1 = require("@bldr/core-node");
const log = __importStar(require("@bldr/log"));
const mediaManager = __importStar(require("@bldr/media-manager"));
// Globals.
const commandsPath = path_1.default.join(__dirname, 'commands');
/**
 * To avoid duplicate aliases. The `commander` doesn’t complain about
 * duplicates.
 */
const aliases = [];
function increaseVerbosity(dummyValue, previous) {
    const newVerbositiy = previous + 1;
    log.setLogLevel(newVerbositiy);
    mediaManager.setLogLevel(newVerbositiy);
    return newVerbositiy;
}
const program = new commander_1.Command();
program.option('-v, --verbose', 'Be more verbose', increaseVerbosity, 2);
program.option('--parent-pres-dir', 'Run the normalize command on all files in the parent presentation folder.');
program.on('command:*', function () {
    console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
    process.exit(1);
});
function convertPathArgToParentPresDir(args) {
    const allOpts = collectAllOpts(program);
    if (allOpts.parentPresDir != null &&
        allOpts.parentPresDir === true &&
        Array.isArray(args[0]) &&
        typeof args[0][0] === 'string') {
        const presParentDir = mediaManager.locationIndicator.getPresParentDir(args[0][0]);
        if (presParentDir != null) {
            log.info('--parent-pres-dir: Run the task on the parent presentation folder: %s', [presParentDir]);
            args[0][0] = presParentDir;
        }
    }
    return args;
}
/**
 * We use a closure to be able te require the subcommands ad hoc on invocation.
 * To avoid long loading times by many subcommands.
 *
 * @param commandName - The name of the command.
 */
function actionHandler(commandName, def) {
    return function (...args) {
        if (def.checkExecutable != null) {
            core_node_1.checkExecutables(def.checkExecutable);
        }
        // eslint-disable-next-line
        const action = require(path_1.default.join(commandsPath, commandName, 'action.js'));
        args = [...arguments, program.opts()];
        args = convertPathArgToParentPresDir(args);
        // To be able to export some functions other than
        // the action function from the subcommands.
        if (typeof action === 'function') {
            return action(...args);
        }
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
    log.error('Specify a subcommand.');
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
            log.error(String(error));
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
        .catch(reason => log.info(String(reason)));
}
