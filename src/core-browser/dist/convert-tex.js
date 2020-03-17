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

  capt(regexp) {
    return `(${regexp})`;
  }

  cmd(macroName, regexp) {
    if (!regexp) regexp = '([^\\}]+?)';
    return `\\\\${macroName}\\{${regexp}\\}`;
  }

  env(envName, regexp) {
    if (!regexp) regexp = this.captDotAll;
    return this.cmd('begin', envName) + regexp + this.cmd('end', envName);
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
  return new RegExp(regBuilder.cmd(commandName), 'g');
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

function removeComments(text) {
  text = text.replace(/%\n\s*/g, '');
  return text.replace(/(?<!\\)%.*/g, '');
}

function removeTexHeaderFooter(text) {
  text = text.replace(/[^]*\\begin\{document\}/, '');
  text = text.replace(/\\end\{document\}[^]*/, '');
  return text;
}

function convertTexItemize(text) {
  return text.replace(/\\begin\{(compactitem|itemize)\}([^]+?)\\end\{(compactitem|itemize)\}/g, function (match, p1, p2) {
    let text = p2;
    text = text.replace(/\\item\s*/g, '- ');
    text = text.replace(/\n\n/g, '\n');
    text = text.replace(/\n(\w|-> )/g, '\n  $1');
    console.log(text);
    return text;
  });
}

function cleanUpTex(text) {
  text = text.replace(/\n%.*?\n/g, '\n');
  text = text.replace(/\n%.*?\n/g, '\n');
  text = text.replace(/\\-/g, '');
  text = text.replace(/\\\w+\{?.*\}?/g, '');
  return text;
}

function cleanUp(text) {
  text = text.replace(/\n\n\n+/g, '\n\n');
  return text;
}

function convert(text, toTex) {
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
      text = text.replace(reg, rep);
    }
  }

  return text;
}

var _default = {
  convertTexToMd(text) {
    text = removeTexHeaderFooter(text);
    text = convertTexItemize(text);
    text = convert(text, false);
    text = cleanUpTex(text);
    text = cleanUp(text);
    return text;
  },

  convertMdToTex(text) {
    return convert(text, true);
  },

  regBuilder,
  cleanMatch,
  extractMatchAll,
  removeComments
};
exports.default = _default;