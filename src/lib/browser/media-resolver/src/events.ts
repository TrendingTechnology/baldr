type EventCallbackFunction = (...args: any) => {}

type EventName = 'fadeinbegin' | 'fadeinend' | 'fadeoutbegin' | 'fadeoutend'

/**
 * A simple wrapper class for a custom event system. Used in the classes
 * `Sample()` and `Player()`.
 */
export class CustomEventsManager {
  /**
   * An object of callback functions
   */
  private callbacks: {[key: string]: EventCallbackFunction[]}

  constructor () {
    this.callbacks = {}
  }

  /**
   * Trigger a custom event.
   *
   * @param name - The name of the event. Should be in lowercase, for
   *   example `fadeoutbegin`.
   * @param args - One ore more additonal arguments to pass through
   *   the callbacks.
   */
  trigger (name: EventName): void {
    const args = Array.from(arguments)
    args.shift()
    if (!(name in this.callbacks)) {
      this.callbacks[name] = []
    }
    for (const callback of this.callbacks[name]) {
      callback.apply(null, args)
    }
  }

  /**
   * Register callbacks for specific custom event.
   *
   * @param name - The name of the event. Should be in lowercase, for
   *   example `fadeoutbegin`.
   * @param callback - A function which gets called when the
   *   event is triggered.
   */
  on (name: EventName, callback: EventCallbackFunction): void {
    if (!(name in this.callbacks)) {
      this.callbacks[name] = []
    }
    this.callbacks[name].push(callback)
  }
}
