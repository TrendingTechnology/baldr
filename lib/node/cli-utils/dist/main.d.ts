/**
 * Some utilities for the subcommands of the package @bldr/cli.
 *
 * @module @bldr/cli-utils
 */
/// <reference types="node" />
import 'object-assign';
interface CommandRunnerOption {
    verbose: boolean;
}
interface CommandRunnerExecOption {
    cwd?: string;
    detached?: boolean;
    shell?: boolean;
    encoding?: string;
}
declare class CommandResult {
    stdout?: string;
    stderr?: string;
    constructor({ stdout, stderr }: any);
}
export declare function execute(args: string[], options?: CommandRunnerExecOption): Promise<CommandResult>;
/**
 * Run commands on the command line in a nice and secure fashion.
 */
export declare class CommandRunner {
    /**
     * Print out captured stdout and stderr of the method exec form
     * childProcess.
     */
    private readonly verbose;
    /**
     * An instance of the Ora package terminal spinner.
     *
     * @see {@link https://www.npmjs.com/package/ora}
     */
    private spinner;
    /**
     * An instance of the Gauge progress bar.
     */
    private readonly gauge;
    /**
     * The current log message. If you use `this.log(message)`, message is
     * stored in this attribute. `this.exec(args[])` appends in the verbose mode
     * stdout and stderr to this message.
     */
    private message;
    constructor(options?: CommandRunnerOption);
    checkRoot(): void;
    /**
     * Start the Ora terminal spinner.
     */
    startSpin(): void;
    /**
     * Start the Gauge progress bar.
     */
    startProgress(): void;
    /**
     * Update the Gauge progress bar.
     *
     * @param completed -  The percent completed as a value between 0 and 1.
     * @param text - The text displayed to the right of the image.
     */
    updateProgress(completed: number, text: string): void;
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
    exec(args: string[], options?: CommandRunnerExecOption): Promise<CommandResult>;
    execSync(args: string[]): CommandResult;
    /**
     * Append the buffed data stream from the child process to the spinner text.
     *
     * @param data - The binary output from childProcess.
     */
    logStdOutErr(data: Buffer): void;
    /**
     * Set the spinner text and cut the lenght of the text to fit in a
     * terminal window.
     *
     * @param text - The text to set on the spinner.
     */
    private setSpinnerText;
    /**
     * @param message - A message to show after the spinner.
     */
    log(message: string): void;
    /**
     * Catch an error and exit the progress.
     */
    catch(error: Error): void;
    /**
     * Stop the gauge progress bar.
     */
    stopProgress(): void;
    /**
     * Stop the command line spinner.
     */
    stopSpin(): void;
}
export {};
