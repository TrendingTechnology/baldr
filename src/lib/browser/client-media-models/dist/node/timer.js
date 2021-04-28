"use strict";
class Timer {
    constructor() {
        this.ids = [];
    }
}
/**
 * We have to clear the timeouts. A not yet finished playbook with a
 * duration - stopped to early - cases that the next playback gets stopped
 * to early.
 */
class TimeOut extends Timer {
    set(func, delay) {
        this.ids.push(setTimeout(func, delay));
    }
    clear() {
        for (const id of this.ids) {
            clearTimeout(id);
        }
    }
}
/**
 * Wrapper class around the function `setInterval` to store the `id`s returned
 * by the function to be able to clear the function.
 */
class Interval extends Timer {
    /**
     * Repeatedly call a function.
     *
     * @param func - A function to be executed every delay
     *   milliseconds.
     * @param delay - The time, in milliseconds (thousandths of a
     *   second), the timer should delay in between executions of the specified
     *   function or code.
     */
    set(func, delay) {
        this.ids.push(setInterval(func, delay));
    }
    /**
     * Cancel a timed, repeating action which was previously established by a
     * call to set().
     */
    clear() {
        for (const id of this.ids) {
            clearInterval(id);
        }
    }
}
