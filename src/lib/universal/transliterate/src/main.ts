/// https://github.com/sindresorhus/transliterate/blob/main/index.js

import deburr from 'lodash.deburr'
// import escapeStringRegexp from 'escape-string-regexp'
import builtinReplacements from './replacements'

// https://github.com/sindresorhus/escape-string-regexp/blob/main/index.js
function escapeStringRegexp (string: string) {
  if (typeof string !== 'string') {
    throw new TypeError('Expected a string')
  }

  // Escape characters with special meaning either inside or outside character sets.
  // Use a simple backslash escape when it’s always valid, and a `\xnn` escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
  return string.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d')
}

const doCustomReplacements = (string: string, replacements: Map<string, string>) => {
  for (const [key, value] of replacements) {
    // TODO: Use `String#replaceAll()` when targeting Node.js 16.
    string = string.replace(new RegExp(escapeStringRegexp(key), 'g'), value)
  }

  return string
}

type Replacements = [key: string, value: string][]

interface Options {
  customReplacements: Replacements
}

export default function transliterate (string: string, options?: Options) {
  if (typeof string !== 'string') {
    throw new TypeError(`Expected a string, got \`${typeof string}\``)
  }

  options = {
    customReplacements: [],
    ...options
  }

  const customReplacements = new Map<string, string>([
    ...builtinReplacements as Replacements,
    ...options.customReplacements
  ])

  string = string.normalize()
  string = doCustomReplacements(string, customReplacements)
  string = deburr(string)

  return string
}
