"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

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

function test() {
  const exampleTex = `
\\section{Ludwig van Beethoven}

\\person{Ludwig van Beethoven} (/ˈlʊdvɪɡ væn ˈbeɪt(h)oʊvən/  German:
[ˈluːtvɪç fan ˈbeːthoːfn̩]; baptised 17 December 1770[1] --- 26 March
1827) was a \\textbf{German composer} and \\textit{pianist}. He was a
crucial figure in the transition between the \\stil{classical} and
\\stil{romantic} eras in classical music and is considered to be one of
the \\emph{greatest composers} of all time.

\\person{Beethoven} was born in Bonn, the capital of the Electorate of
Cologne, which was part of the Holy Roman Empire. His musical talent was
obvious at an early age, and he was harshly and intensively taught by
his father \\person{Johann van Beethoven}, who thought this would enable
him to become a child prodigy like \\person{Mozart}. He was later taught
by the composer and conductor \\person{Christian Gottlob Neefe}. At age
21, he moved to Vienna and studied composition with \\person{Joseph
Haydn}. \\person{Beethoven} then gained a reputation as a virtuoso
pianist, and he was soon courted by \\person{Karl Alois, Prince
Lichnowsky} for compositions, which resulted in \\stueck{Opus 1} in 1795.

stueck*: \\stueck*{Für Elise}
stueck: \\stueck{Für Elise}
person: \\person{Ludwig van Beethoven}
stil: \\stil{Klassik}
fachbegriff: \\fachbegriff{Sonatenhauptsatzform}
em dash: ---
en dash: --
pfeil: \\pfeil{}
pfeil ohne klammern: \\pfeil{}
emph: \\emph{Lorem ipsum}
textbf: \\textbf{Lorem ipsum}
textit: \\textit{Lorem ipsum}
`;
  console.log(convert(exampleTex));
  const exampleMd = `
\\section{Ludwig van Beethoven}

<em class="person">Ludwig van Beethoven</em> (/ˈlʊdvɪɡ væn ˈbeɪt(h)oʊvən/  German:
[ˈluːtvɪç fan ˈbeːthoːfn̩]; baptised 17 December 1770[1] — 26 March
1827) was a <strong>German composer</strong> and <i>pianist</i>. He was a
crucial figure in the transition between the <em class="genre">classical</em> and
<em class="genre">romantic</em> eras in classical music and is considered to be one of
the <em>greatest composers</em> of all time.

<em class="person">Beethoven</em> was born in Bonn, the capital of the Electorate of
Cologne, which was part of the Holy Roman Empire. His musical talent was
obvious at an early age, and he was harshly and intensively taught by
his father <em class="person">Johann van Beethoven</em>, who thought this would enable
him to become a child prodigy like <em class="person">Mozart</em>. He was later taught
by the composer and conductor <em class="person">Christian Gottlob Neefe</em>. At age
21, he moved to Vienna and studied composition with <em class="person">Joseph
Haydn</em>. <em class="person">Beethoven</em> then gained a reputation as a virtuoso
pianist, and he was soon courted by <em class="person">Karl Alois, Prince
Lichnowsky</em> for compositions, which resulted in <em class="piece">Opus 1</em> in 1795.

stueck*: <em class="piece">„Für Elise“</em>
stueck: <em class="piece">Für Elise</em>
person: <em class="person">Ludwig van Beethoven</em>
stil: <em class="genre">Klassik</em>
fachbegriff: <em class="term">Sonatenhauptsatzform</em>
em dash: —
en dash: –
pfeil: ->
pfeil ohne klammern: ->
emph: <em>Lorem ipsum</em>
textbf: <strong>Lorem ipsum</strong>
textit: <i>Lorem ipsum</i>
`;
  console.log(convert(exampleMd, true));
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
  }

};
exports.default = _default;