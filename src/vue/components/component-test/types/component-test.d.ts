import { PluginFunction } from 'vue'

export declare class ComponentTest {
  constructor()

  /**
   * Show the message.
   *
   * @param message A message
   */
  msg(message: string): Function

  static install: PluginFunction<never>
}
