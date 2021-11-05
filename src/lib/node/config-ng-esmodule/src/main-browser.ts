import { Configuration as ConfigurationType } from './types'

export type Configuration = ConfigurationType

declare const config: Configuration

/**
 * Re-exports the global config object.
 */
export function getConfig (): Configuration {
  return config
}
