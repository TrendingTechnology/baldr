import { Configuration as ConfigurationType } from './types/main'

export type Configuration = ConfigurationType

declare const config: Configuration

/**
 * Re-exports the global config object.
 */
export function getConfig (): Configuration {
  return config
}

/**
 * A simple analog of Node.js's `path.join(...)`.
 * https://gist.github.com/creationix/7435851#gistcomment-3698888
 */
export function joinPath (...segments: string[]): string {
  const parts: string[] = segments.reduce<string[]>((parts, segment) => {
    // Remove leading slashes from non-first part.
    if (parts.length > 0) {
      segment = segment.replace(/^\//, '')
    }
    // Remove trailing slashes.
    segment = segment.replace(/\/$/, '')
    return parts.concat(segment.split('/'))
  }, [])
  const resultParts: string[] = []
  for (const part of parts) {
    if (part === '.') {
      continue
    }
    if (part === '..') {
      resultParts.pop()
      continue
    }
    resultParts.push(part)
  }
  return resultParts.join('/')
}

export function getMediaPath (...relPath: string[]): string {
  if (config == null) {
    getConfig()
  }
  return joinPath(config.mediaServer.basePath, ...relPath)
}
