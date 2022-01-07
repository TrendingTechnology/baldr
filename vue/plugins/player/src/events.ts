/**
 * A simple wrapper class for a custom event system. Used in the classes
 * `Playable()` and `Player()`.
 */
export class EventsListenerStore {
  /**
   * An object of callback functions.
   */
  private callbacks: { [eventName: string]: Function[] }

  constructor () {
    this.callbacks = {}
  }

  /**
   * Trigger a custom event.
   *
   * @param eventName - The name of the event. Should be in lowercase, for
   *   example `fadeoutbegin`.
   * @param args - One ore more additonal arguments to pass through
   *   the callbacks.
   */
  public trigger (eventName: string, ...args: any[]): void {
    if (this.callbacks[eventName] == null) {
      this.callbacks[eventName] = []
    }
    for (const callback of this.callbacks[eventName]) {
      callback.apply(null, args)
    }
  }

  /**
   * Register callbacks for specific custom event.
   *
   * @param eventName - The name of the event. Should be in lowercase, for
   *   example `fadeoutbegin`.
   * @param callback - A function which gets called when the
   *   event is triggered.
   */
  public register (eventName: string, callback: Function): void {
    if (this.callbacks[eventName] == null) {
      this.callbacks[eventName] = []
    }
    this.callbacks[eventName].push(callback)
  }

  private removeCallbackInStore (callback: Function, store: Function[]): void {
    for (let index = 0; index < store.length; index++) {
      if (store[index] === callback) {
        store.splice(index, 1)
        return
      }
    }
  }

  public remove (callback: Function, eventName?: string): void {
    const eventNames: string[] =
      eventName != null ? [eventName] : Object.keys(this.callbacks)
    for (const eventName of eventNames) {
      this.removeCallbackInStore(callback, this.callbacks[eventName])
    }
  }
}
