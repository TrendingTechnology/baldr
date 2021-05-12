declare type EventCallbackFunction = (...args: any) => {};
declare type EventName = 'fadeinbegin' | 'fadeinend' | 'fadeoutbegin' | 'fadeoutend';
/**
 * A simple wrapper class for a custom event system. Used in the classes
 * `Sample()` and `Player()`.
 */
export declare class CustomEventsManager {
    /**
     * An object of callback functions
     */
    private callbacks;
    constructor();
    /**
     * Trigger a custom event.
     *
     * @param name - The name of the event. Should be in lowercase, for
     *   example `fadeoutbegin`.
     * @param args - One ore more additonal arguments to pass through
     *   the callbacks.
     */
    trigger(name: EventName): void;
    /**
     * Register callbacks for specific custom event.
     *
     * @param name - The name of the event. Should be in lowercase, for
     *   example `fadeoutbegin`.
     * @param callback - A function which gets called when the
     *   event is triggered.
     */
    on(name: EventName, callback: EventCallbackFunction): void;
}
export {};
