/**
 * A naive implementation of a TeX to Markdown and vice versa converter.
 *
 * Attention: Firefox doesn’t support the `dotAll` flag `s`!
 *
 * @module @bldr/core-browser/convert-tex
 */

/**
 * Build and assemble strings to generate regular expressions from.
 */
class RegExpBuilder {
  constructor () {
    this.dotAll = '[^]+?'
    this.captDotAll = this.capt(this.dotAll)
    this.whiteNewline = '[\\s\n]*?'
  }

  /**
   * Format a capture group `(regexp)`.
   *
   * @param {String} regExp - A string to build a regular expression from.
   *
   * @returns {String} A string to build a regular expression from.
   */
  capt (regExp) {
    return `(${regExp})`
  }

  /**
   * Assemble a regular expression string to capture a TeX macro / command
   * `\makroName{}`.
   *
   * @param {String} macroName -
   * @param {String} regExp - A string to build a regular expression from.
   *
   * @returns {String} A string to build a regular expression from.
   */
  cmd (macroName, regExp = '') {
    if (!regExp) regExp = '([^\\}]+?)'
    return `\\\\${macroName}\\{${regExp}\\}`
  }

  /**
   * Build a regular expression for a TeX environment.
   *
   * @param {String} envName - The name of the environment.
   * @param {String} regExp - A string to build a regular expression from.
   *
   * @returns {String} A string to build a regular expression from.
   */
  env (envName, regExp) {
    if (!regExp) regExp = this.captDotAll
    return this.cmd('begin', envName) + regExp + this.cmd('end', envName)
  }
}

const regBuilder = new RegExpBuilder()

/**
 *
 * @param {*} match
 * @param {Array} excludeCaptureGroups - An array of capture group strings
 *   to exclude in the result matches for example regexp:
 *   `(itemize|compactitem|sub)` -> `['itemize', 'compactitem', 'sub']`
 */
function cleanMatch (match, excludeCaptureGroups) {
  const exclude = excludeCaptureGroups
  // Convert to Array
  match = [...match]
  // Remove first (the complete match)
  match.shift()

  const result = []
  for (const group of match) {
    if ((!exclude && group) || (exclude && group && !exclude.includes(group))) {
      result.push(group)
    }
  }
  return result
}

/**
 * @param {String} text - Text to search for matches
 * @param {String} regExp - Regular expressed gets compiled
 * @param {Array} matches - Array gets filled with cleaned matches.
 * @param {Array} excludeCaptureGroups - An array of capture group strings
 *   to exclude in the result matches for example regex:
 *   `(itemize|compactitem|sub)` -> `['itemize', 'compactitem', 'sub']`
 *
 * @returns {String}
 */
function extractMatchAll (text, regExp, matches, excludeCaptureGroups) {
  regExp = new RegExp(regExp, 'g')
  if (text.match(regExp)) {
    const rawMatches = text.matchAll(regExp)
    for (const match of rawMatches) {
      text = text.replace(match[0], '')
      matches.push(cleanMatch(match, excludeCaptureGroups))
    }
    return text
  }
  return text
}

/**
 * @param {String} commandName - A simple LaTeX macro / command name
 *   from example: `emph` `\emph{.*}`
 */
function texReg (commandName) {
  return new RegExp(regBuilder.cmd(commandName), 'g')
}

/**
 * @param {String} commandName - A simple LaTeX macro / command name
 *   from example: `emph` `\emph{.*}`
 */
function texRep (commandName) {
  return `\\${commandName}{$1}`
}

/**
 *
 * @param {*} tagName
 * @param {*} className
 */
function mdReg (tagName, className) {
  let classMarkup = ''
  if (className) {
    classMarkup = ` class="${className}"`
  }
  return new RegExp('<' + tagName + classMarkup + '>([^<>]+?)</' + tagName + '>', 'g')
}

/**
 * @param {String} tagName
 * @param {String} className
 *
 * @returns {String}
 */
function mdRep (tagName, className) {
  let classMarkup = ''
  if (className) {
    classMarkup = ` class="${className}"`
  }
  return `<${tagName}${classMarkup}>$1</${tagName}>`
}

/**
 * @param {String} texCommandName
 * @param {String} htmlTagName
 * @param {String} htmlClassName
 *
 * @returns {Array}
 */
function semanticSpec (texCommandName, htmlTagName, htmlClassName) {
  return [{
    tex: { reg: texReg(texCommandName), rep: texRep(texCommandName) },
    md: { reg: mdReg(htmlTagName, htmlClassName), rep: mdRep(htmlTagName, htmlClassName) }
  }]
}

/**
 * `reg`: Regular expression
 * `rep`: Replacement
 *
 * ```js
 * {
 *   tex: { reg: , rep:  },
 *   md: { reg: , rep:  }
 * }
 * ```
 *
 * @type {Array}
 */
const specification = [
  {
    tex: { reg: /\\stueck\*\{([^\}]+?)\}/g, rep: '\\stueck*{$1}' }, // eslint-disable-line
    md: { reg: /<em class="piece">„([^<>]+?)“<\/em>/g, rep: '<em class="piece">„$1“</em>' }
  },
  ...semanticSpec('stueck', 'em', 'piece'),
  ...semanticSpec('person', 'em', 'person'),
  ...semanticSpec('stil', 'em', 'genre'),
  ...semanticSpec('fachbegriff', 'em', 'term'),
  { tex: '---', md: '—' }, // U+2014 EM DASH
  { tex: '--', md: '–' }, // U+2013 EN DASH
  { tex: { reg: /\\pfeil\{?\}?/g, rep: '\\pfeil{}' }, md: '->' },
  { tex: '"emph"', md: '"em"' },
  { tex: '"textbf"', md: '"strong"' },
  { tex: '"textit"', md: '"i"' },
  {
    tex: { reg: texReg('section'), rep: texRep('section') },
    md: { reg: /# (.*)\n/g, rep: '# $1' }
  }
]

/**
 *
 * @param {String} text - A input string to convert.
 *
 * @see {@link https://tex.stackexchange.com/a/451849/42311}
 */
function removeTexComments (text) {
  // TeX comment to fix hyphenation
  // Lorem ip-%
  // sum
  text = text.replace(/%\n\s*/g, '')
  // Lookbehinds not working in Firefox
  // text = text.replace(/(?<!\\)%.*/g, '')
  text = text.replace(/%.*/g, '')
  return text
}

/**
 *
 * @param {String} text - A input string to convert.
 */
function removeTexHeaderFooter (text) {
  // Remove TeX header and footer
  text = text.replace(/[^]*\\begin\{document\}/, '')
  text = text.replace(/\\end\{document\}[^]*/, '')
  return text
}

/**
 *
 * @param {String} text - A input string to convert.
 */
function convertTexItemize (text) {
  return text.replace(
    /\\begin\{(compactitem|itemize)\}([^]+?)\\end\{(compactitem|itemize)\}/g,
    function (match, p1, p2) {
      let text = p2
      // \item Lorem -> - Lorem
      text = text.replace(/\\item\s*/g, '- ')
      // No empty lines
      text = text.replace(/\n\n/g, '\n')
      text = text.replace(/\n(\w|-> )/g, '\n  $1')
      console.log(text)
      return text
    }
  )
}

/**
 *
 * @param {String} text - A input string to convert.
 */
function cleanUpTex (text) {
  // Delete comments
  text = text.replace(/\n%.*?\n/g, '\n')
  text = text.replace(/\n%.*?\n/g, '\n')
  // Delete \-
  text = text.replace(/\\-/g, '')
  // Left TeX commands
  text = text.replace(/\\\w+\{?.*\}?/g, '')
  return text
}

/**
 *
 * @param {String} text - A input string to convert.
 *
 * @returns {String} A cleaned up string.
 */
function cleanUp (text) {
  text = text.replace(/\n\n\n+/g, '\n\n')
  return text
}

/**
 * Convert a text input from TeX to Markdown or from Markdown to TeX.
 *
 * @param {String} text - The text input.
 * @param {Boolean} toTex - True to convert from Markdown to TeX. False to
 *   convert from TeX to Markdown.
 */
function convert (text, toTex) {
  const specsReq = []
  const specsRep = []
  for (const spec of specification) {
    if (!toTex) {
      specsReq.push(spec.tex)
      specsRep.push(spec.md)
    } else {
      specsReq.push(spec.md)
      specsRep.push(spec.tex)
    }
  }
  for (let i = 0; i < specification.length; i++) {
    let reg = null
    let rep = null
    const specReg = specsReq[i]
    const specRep = specsRep[i]

    // reg regexp regular expression
    if (typeof specReg === 'string') {
      if (specReg.charAt(0) === '"') {
        // "em" -> em
        const markupName = specReg.substr(1, specReg.length - 2)
        reg = !toTex ? texReg(markupName) : mdReg(markupName)
      } else {
        reg = new RegExp(specReg, 'g')
      }
    } else if (specReg instanceof RegExp) {
      reg = specReg
    } else if (typeof specReg === 'object') {
      reg = specReg.reg
    }

    // rep replacement
    if (typeof specRep === 'string') {
      if (specRep.charAt(0) === '"') {
        rep = mdRep(specRep.substr(1, specRep.length - 2))
      } else {
        rep = specRep
      }
    } else if (typeof specRep === 'object') {
      rep = specRep.rep
    }
    if (reg && rep) {
      text = text.replace(reg, rep)
    }
  }

  return text
}

export default {
  convertTexToMd (text) {
    text = removeTexHeaderFooter(text)
    text = convertTexItemize(text)
    text = convert(text, false)
    text = cleanUpTex(text)
    text = cleanUp(text)
    return text
  },
  convertMdToTex (text) {
    return convert(text, true)
  },
  regBuilder,
  cleanMatch,
  extractMatchAll,
  removeComments: removeTexComments
}
