declare class Timer {
    /**
     * An array of `setTimeout` IDs.
     */
    protected ids: any[];
    constructor();
}
/**
 * We have to clear the timeouts. A not yet finished playbook with a
 * duration - stopped to early - cases that the next playback gets stopped
 * to early.
 */
export declare class TimeOut extends Timer {
    set(func: () => void, delay: number): void;
    clear(): void;
}
/**
 * Wrapper class around the function `setInterval` to store the `id`s returned
 * by the function to be able to clear the function.
 */
export declare class Interval extends Timer {
    /**
     * Repeatedly call a function.
     *
     * @param func - A function to be executed every delay
     *   milliseconds.
     * @param delay - The time, in milliseconds (thousandths of a
     *   second), the timer should delay in between executions of the specified
     *   function or code.
     */
    set(func: () => void, delay: number): void;
    /**
     * Cancel a timed, repeating action which was previously established by a
     * call to set().
     */
    clear(): void;
}
export {};
