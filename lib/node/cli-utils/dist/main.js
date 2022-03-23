/**
 * Some utilities for the subcommands of the package @bldr/cli.
 *
 * @module @bldr/cli-utils
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as childProcess from 'child_process';
import os from 'os';
import ora from 'ora';
// TODO remove dependency object-assign
// Error: Cannot find module 'object-assign'
import 'object-assign';
import Gauge from 'gauge';
import * as log from '@bldr/log';
class CommandResult {
    constructor({ stdout, stderr }) {
        this.stdout = stdout;
        this.stderr = stderr;
    }
}
class ArgsParser {
    constructor(args) {
        this.args = [];
        this.command = args[0];
        if (args.length > 1) {
            this.args = args.slice(1);
        }
    }
    toString() {
        if (this.args.length > 0) {
            return `${this.command} ${this.args.join(' ')}`;
        }
        else {
            return this.command;
        }
    }
}
export function execute(args, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const argsParser = new ArgsParser(args);
        // To get error messages on unkown commands
        if (options == null) {
            options = {};
        }
        if (options.encoding === undefined) {
            options.encoding = 'utf-8';
        }
        return yield new Promise((resolve, reject) => {
            const command = childProcess.spawn(argsParser.command, argsParser.args, options);
            if ((options === null || options === void 0 ? void 0 : options.detached) != null && options.detached) {
                command.unref();
                resolve(new CommandResult({}));
            }
            let stdout = '';
            let stderr = '';
            command.stdout.setEncoding('utf-8');
            command.stdout.on('data', (data) => {
                data = data.trim();
                log.debug('stdout: %s', [data]);
                stdout = stdout + data;
            });
            command.stderr.setEncoding('utf-8');
            command.stderr.on('data', (data) => {
                data = data.trim();
                log.debug('stderr: %s', [data]);
                stderr = stderr + data;
            });
            command.on('error', code => {
                reject(new Error(stderr));
            });
            command.on('exit', code => {
                if (code === 0) {
                    resolve(new CommandResult({ stdout, stderr }));
                }
                else {
                    reject(new Error(stderr));
                }
            });
        });
    });
}
/**
 * Run commands on the command line in a nice and secure fashion.
 */
export class CommandRunner {
    constructor(options) {
        this.verbose = (options === null || options === void 0 ? void 0 : options.verbose) != null && (options === null || options === void 0 ? void 0 : options.verbose);
        this.spinner = ora({ spinner: 'line' });
        this.gauge = new Gauge();
        this.gauge.setTheme('ASCII');
        this.message = '';
    }
    checkRoot() {
        const user = os.userInfo();
        if (user.username !== 'root') {
            console.error('You need to be root: sudo /usr/local/bin/baldr …');
            process.exit();
        }
    }
    /**
     * Start the Ora terminal spinner.
     */
    startSpin() {
        this.spinner.start();
    }
    /**
     * Start the Gauge progress bar.
     */
    startProgress() {
        this.gauge.show('default', 0);
    }
    /**
     * Update the Gauge progress bar.
     *
     * @param completed -  The percent completed as a value between 0 and 1.
     * @param text - The text displayed to the right of the image.
     */
    updateProgress(completed, text) {
        this.gauge.pulse();
        this.gauge.show(text, completed);
    }
    /**
     * Execute a command on the command line. This function is a wrapper around
     * [`childProcess.spawn()`](https://nodejs.org/api/child_process.html#child_process_child_process_spawnsync_command_args_options).
     *
     * For example `cmd.exec('youtube-dl', youtubeId, { cwd: ytDir })`.
     * We have to run the commands asynchronous because of the spinner.
     *
     * @param args - One or more arguments.
     * @param options - See `childProcess.spawn()`
     *   [options](https://nodejs.org/api/child_process.html#child_process_child_process_spawnsync_command_args_options).
     *
     * @returns
     *   [see on nodejs.org](https://nodejs.org/api/child_process.html#child_process_child_process_spawnsync_command_args_options).
     */
    exec(args, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const argsParser = new ArgsParser(args);
            if (this.verbose) {
                this.startSpin();
            }
            // To get error messages on unkown commands
            if (options == null) {
                options = {};
            }
            if (options.shell === undefined) {
                options.shell = true;
            }
            if (options.encoding === undefined) {
                options.encoding = 'utf-8';
            }
            return yield new Promise((resolve, reject) => {
                const command = childProcess.spawn(argsParser.command, argsParser.args, options);
                if (this.verbose) {
                    this.message = log.format('Exec: %s', [argsParser.toString()]);
                }
                if ((options === null || options === void 0 ? void 0 : options.detached) != null && options.detached) {
                    command.unref();
                    resolve(new CommandResult({}));
                }
                let stdout = '';
                let stderr = '';
                command.stdout.on('data', (data) => {
                    this.logStdOutErr(data);
                    stdout = stdout + data.toString();
                });
                // somehow songbook build stays open without this event.
                command.stderr.on('data', (data) => {
                    this.logStdOutErr(data);
                    stderr = stderr + data.toString();
                });
                command.on('error', code => {
                    reject(new Error(stderr));
                });
                command.on('exit', code => {
                    if (code === 0) {
                        resolve(new CommandResult({ stdout, stderr }));
                    }
                    else {
                        reject(new Error(stderr));
                    }
                });
            });
        });
    }
    execSync(args) {
        const argsParser = new ArgsParser(args);
        const command = childProcess.spawnSync(argsParser.command, argsParser.args, { encoding: 'utf-8', shell: true });
        if (command.status !== 0) {
            if (command.stderr != null) {
                log.error(command.stderr);
            }
            throw new Error(log.format('Command “%s” exists with a nonzero exit code.', [argsParser.toString()], 'none'));
        }
        return new CommandResult(command);
    }
    /**
     * Append the buffed data stream from the child process to the spinner text.
     *
     * @param data - The binary output from childProcess.
     */
    logStdOutErr(data) {
        if (this.verbose) {
            let cleanedText = data.toString().trim();
            cleanedText = cleanedText.replace(/<s> \[webpack\.Progress\]/, '');
            cleanedText = cleanedText.replace(/\s{2,}/, ' ');
            this.setSpinnerText(this.message + ' ' + cleanedText);
        }
    }
    /**
     * Set the spinner text and cut the lenght of the text to fit in a
     * terminal window.
     *
     * @param text - The text to set on the spinner.
     */
    setSpinnerText(text) {
        this.spinner.text = text.substring(0, process.stdout.columns - 3);
    }
    /**
     * @param message - A message to show after the spinner.
     */
    log(message) {
        this.message = message;
        this.setSpinnerText(message);
    }
    /**
     * Catch an error and exit the progress.
     */
    catch(error) {
        this.stopSpin();
        console.log(error);
        process.exit();
    }
    /**
     * Stop the gauge progress bar.
     */
    stopProgress() {
        this.gauge.hide();
    }
    /**
     * Stop the command line spinner.
     */
    stopSpin() {
        this.spinner.stop();
    }
}
