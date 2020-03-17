"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class RegExpBuilder {
  constructor() {
    this.dotAll = '[^]+?';
    this.captDotAll = this.capt(this.dotAll);
    this.whiteNewline = '[\\s\n]*?';
  }

  capt(regex) {
    return `(${regex})`;
  }

  cmd(macroName, regex) {
    return `\\\\${macroName}\\{${regex}\\}`;
  }

  env(envName, regex) {
    if (!regex) regex = this.captDotAll;
    return this.cmd('begin', envName) + regex + this.cmd('end', envName);
  }

}

const regBuilder = new RegExpBuilder();

function cleanMatch(match, excludeCaptureGroups) {
  const exclude = excludeCaptureGroups;
  match = [...match];
  match.shift();
  const result = [];

  for (const group of match) {
    if (!exclude && group || exclude && group && !exclude.includes(group)) {
      result.push(group);
    }
  }

  return result;
}

function extractMatchAll(text, regexp, matches, excludeCaptureGroups) {
  regexp = new RegExp(regexp, 'g');

  if (text.match(regexp)) {
    const rawMatches = text.matchAll(regexp);

    for (let match of rawMatches) {
      text = text.replace(match[0], '');
      matches.push(cleanMatch(match, excludeCaptureGroups));
    }

    return text;
  }

  return text;
}

function texReg(commandName) {
  return new RegExp('\\\\' + commandName + '\\{([^\\}]+?)\\}', 'g');
}

function texRep(commandName) {
  return `\\${commandName}{$1}`;
}

function mdReg(tagName, className) {
  let classMarkup = '';

  if (className) {
    classMarkup = ` class="${className}"`;
  }

  return new RegExp('<' + tagName + classMarkup + '>([^<>]+?)<\/' + tagName + '>', 'g');
}

function mdRep(tagName, className) {
  let classMarkup = '';

  if (className) {
    classMarkup = ` class="${className}"`;
  }

  return `<${tagName}${classMarkup}>$1</${tagName}>`;
}

function semanticSpec(texCommandName, htmlTagName, htmlClassName) {
  return [{
    tex: {
      reg: texReg(texCommandName),
      rep: texRep(texCommandName)
    },
    md: {
      reg: mdReg(htmlTagName, htmlClassName),
      rep: mdRep(htmlTagName, htmlClassName)
    }
  }];
}

const specification = [{
  tex: {
    reg: /\\stueck\*\{([^\}]+?)\}/g,
    rep: '\\stueck*{$1}'
  },
  md: {
    reg: /<em class="piece">„([^<>]+?)“<\/em>/g,
    rep: '<em class="piece">„$1“</em>'
  }
}, ...semanticSpec('stueck', 'em', 'piece'), ...semanticSpec('person', 'em', 'person'), ...semanticSpec('stil', 'em', 'genre'), ...semanticSpec('fachbegriff', 'em', 'term'), {
  tex: '---',
  md: '—'
}, {
  tex: '--',
  md: '–'
}, {
  tex: {
    reg: /\\pfeil\{?\}?/g,
    rep: '\\pfeil{}'
  },
  md: '->'
}, {
  tex: '"emph"',
  md: '"em"'
}, {
  tex: '"textbf"',
  md: '"strong"'
}, {
  tex: '"textit"',
  md: '"i"'
}, {
  tex: {
    reg: texReg('section'),
    rep: texRep('section')
  },
  md: {
    reg: /# (.*)\n/g,
    rep: '# $1'
  }
}];

function removeTexHeaderFooter(content) {
  content = content.replace(/[^]*\\begin\{document\}/, '');
  content = content.replace(/\\end\{document\}[^]*/, '');
  return content;
}

function convertTexItemize(content) {
  return content.replace(/\\begin\{(compactitem|itemize)\}([^]+?)\\end\{(compactitem|itemize)\}/g, function (match, p1, p2) {
    let content = p2;
    content = content.replace(/\\item\s*/g, '- ');
    content = content.replace(/\n\n/g, '\n');
    content = content.replace(/\n(\w|-> )/g, '\n  $1');
    console.log(content);
    return content;
  });
}

function cleanUpTex(content) {
  content = content.replace(/\n%.*?\n/g, '\n');
  content = content.replace(/\n%.*?\n/g, '\n');
  content = content.replace(/\\-/g, '');
  content = content.replace(/\\\w+\{?.*\}?/g, '');
  return content;
}

function cleanUp(content) {
  content = content.replace(/\n\n\n+/g, '\n\n');
  return content;
}

function convert(content, toTex) {
  const specsReq = [];
  const specsRep = [];

  for (const spec of specification) {
    if (!toTex) {
      specsReq.push(spec.tex);
      specsRep.push(spec.md);
    } else {
      specsReq.push(spec.md);
      specsRep.push(spec.tex);
    }
  }

  for (let i = 0; i < specification.length; i++) {
    let reg = null;
    let rep = null;
    const specReg = specsReq[i];
    const specRep = specsRep[i];

    if (typeof specReg === 'string') {
      if (specReg.charAt(0) === '"') {
        const markupName = specReg.substr(1, specReg.length - 2);
        reg = !toTex ? texReg(markupName) : mdReg(markupName);
      } else {
        reg = new RegExp(specReg, 'g');
      }
    } else if (specReg instanceof RegExp) {
      reg = specReg;
    } else if (typeof specReg === 'object') {
      reg = specReg.reg;
    }

    if (typeof specRep === 'string') {
      if (specRep.charAt(0) === '"') {
        rep = mdRep(specRep.substr(1, specRep.length - 2));
      } else {
        rep = specRep;
      }
    } else if (typeof specRep === 'object') {
      rep = specRep.rep;
    }

    if (reg && rep) {
      content = content.replace(reg, rep);
    }
  }

  return content;
}

var _default = {
  convertTexToMd(content) {
    content = removeTexHeaderFooter(content);
    content = convertTexItemize(content);
    content = convert(content, false);
    content = cleanUpTex(content);
    content = cleanUp(content);
    return content;
  },

  convertMdToTex(content) {
    return convert(content, true);
  },

  regBuilder,
  cleanMatch,
  extractMatchAll
};
exports.default = _default;