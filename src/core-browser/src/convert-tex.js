/**
 * A naive implementation of a TeX to Markdown and vice versa converter.
 *
 * Attention: Firefox doesn’t support the `dotAll` flag `s`!
 */

/**
 * @param {String} commandName - A simple LaTeX macro / command name
 *   from example: `emph` `\emph{.*}`
 */
function texReg (commandName) {
  return new RegExp('\\\\' + commandName + '\\{([^\\}]+?)\\}', 'g')
}

/**
 * @param {String} commandName - A simple LaTeX macro / command name
 *   from example: `emph` `\emph{.*}`
 */
function texRep (commandName) {
  return `\\${commandName}{$1}`
}

function mdReg (tagName, className) {
  let classMarkup = ''
  if (className) {
    classMarkup = ` class="${className}"`
  }
  return new RegExp('<' + tagName + classMarkup + '>([^<>]+?)<\/' + tagName + '>', 'g')
}

function mdRep (tagName, className) {
  let classMarkup = ''
  if (className) {
    classMarkup = ` class="${className}"`
  }
  return `<${tagName}${classMarkup}>$1</${tagName}>`
}

function semanticSpec (texCommandName, htmlTagName, htmlClassName) {
  return [{
    tex: { reg: texReg(texCommandName), rep: texRep(texCommandName) },
    md: { reg: mdReg(htmlTagName, htmlClassName), rep: mdRep(htmlTagName, htmlClassName) }
  }]
}

/*

  {
    tex: { reg: , rep:  },
    md: { reg: , rep:  }
  },
*/
const specification = [
  {
    tex: { reg: /\\stueck\*\{([^\}]+?)\}/g, rep: '\\stueck*{$1}' },
    md: { reg: /<em class="piece">„([^<>]+?)“<\/em>/g, rep: '<em class="piece">„$1“</em>' }
  },
  ...semanticSpec('stueck', 'em', 'piece'),
  ...semanticSpec('person', 'em', 'person'),
  ...semanticSpec('stil', 'em', 'genre'),
  ...semanticSpec('fachbegriff', 'em', 'term'),
  { tex: '---', md: '—' }, // U+2014 EM DASH
  { tex: '--', md: '–' }, // U+2013 EN DASH
  { tex: { reg: /\\pfeil\{?\}?/g, rep: '\\pfeil{}'}, md: '->' },
  { tex: '"emph"', md: '"em"' },
  { tex: '"textbf"', md: '"strong"' },
  { tex: '"textit"', md: '"i"' },
  {
    tex: { reg: texReg('section'), rep: texRep('section') },
    md: { reg: /# (.*)\n/g, rep: '# $1'}
  },
]

function removeTexHeaderFooter (content) {
  // Remove TeX header and footer
  content = content.replace(/[^]*\\begin\{document\}/, '')
  content = content.replace(/\\end\{document\}[^]*/, '')
  return content
}

function convertTexItemize (content) {
  return content.replace(
    /\\begin\{(compactitem|itemize)\}([^]+?)\\end\{(compactitem|itemize)\}/g,
    function (match, p1, p2) {
      let content = p2
      // \item Lorem -> - Lorem
      content = content.replace(/\\item\s*/g, '- ')
      // No empty lines
      content = content.replace(/\n\n/g, '\n')
      content = content.replace(/\n(\w|-> )/g, '\n  $1')
      console.log(content)
      return content
    }
  )
}

function cleanUpTex (content) {
  // Delete comments
  content = content.replace(/\n%.*?\n/g, '\n')
  content = content.replace(/\n%.*?\n/g, '\n')
  // Delete \-
  content = content.replace(/\\-/g, '')
  // Left TeX commands
  content = content.replace(/\\\w+\{?.*\}?/g, '')
  return content
}

function cleanUp (content) {
  content = content.replace(/\n\n\n+/g, '\n\n')
  return content
}

function convert (content, toTex) {
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
      content = content.replace(reg, rep)
    }
  }

  return content
}

export default {
  convertTexToMd (content) {
    content = removeTexHeaderFooter(content)
    content = convertTexItemize(content)
    content = convert(content, false)
    content = cleanUpTex(content)
    content = cleanUp(content)
    return content
  },
  convertMdToTex (content) {
    return convert(content, true)
  }
}
