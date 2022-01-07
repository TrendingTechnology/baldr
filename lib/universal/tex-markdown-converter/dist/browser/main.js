/**
 * A naive implementation of a TeX to Markdown and vice versa converter.
 *
 * @module @bldr/tex-markdown-converter
 */
import { convertToYaml } from '@bldr/yaml';
/**
 * Build and assemble strings to generate regular expressions from.
 */
class RegExpBuilder {
    constructor() {
        this.dotAll = '[^]+?';
        this.captDotAll = this.capt(this.dotAll);
        this.whiteNewline = '[\\s\n]*?';
    }
    /**
     * Format a capture group `(regexp)`.
     *
     * @param regExp - A string to build a regular expression from.
     *
     * @returns A string to build a regular expression from.
     */
    capt(regExp) {
        return `(${regExp})`;
    }
    /**
     * Assemble a regular expression string to capture a TeX macro / command
     * `\makroName{}`.
     *
     * @param macroName
     * @param regExp - A string to build a regular expression from.
     *
     * @returns A string to build a regular expression from.
     */
    cmd(macroName, regExp = '') {
        if (regExp == null)
            regExp = '([^\\}]+?)';
        return `\\\\${macroName}\\{${regExp}\\}`;
    }
    /**
     * Build a regular expression for a TeX environment.
     *
     * @param envName - The name of the environment.
     * @param regExp - A string to build a regular expression from.
     *
     * @returns A string to build a regular expression from.
     */
    env(envName, regExp = '') {
        if (regExp == null)
            regExp = this.captDotAll;
        return this.cmd('begin', envName) + regExp + this.cmd('end', envName);
    }
}
export const regBuilder = new RegExpBuilder();
/**
 *
 * @param match
 * @param excludeCaptureGroups - An array of capture group strings
 *   to exclude in the result matches for example regexp:
 *   `(itemize|compactitem|sub)` -> `['itemize', 'compactitem', 'sub']`
 */
function cleanMatch(match, excludeCaptureGroups) {
    const exclude = excludeCaptureGroups;
    // Convert to Array
    match = [...match];
    // Remove first (the complete match)
    match.shift();
    const result = [];
    for (const group of match) {
        if ((exclude == null && group != null) || (exclude != null && group != null && !exclude.includes(group))) {
            result.push(group);
        }
    }
    return result;
}
/**
 * @param text - Text to search for matches
 * @param regExp - Regular expressed gets compiled
 * @param matches - Array gets filled with cleaned matches.
 * @param excludeCaptureGroups - An array of capture group strings
 *   to exclude in the result matches for example regex:
 *   `(itemize|compactitem|sub)` -> `['itemize', 'compactitem', 'sub']`
 *
 * @returns {string}
 */
export function extractMatchAll(text, regExp, matches, excludeCaptureGroups) {
    const compiledRegExp = new RegExp(regExp, 'g');
    if (text.match(compiledRegExp) != null) {
        const rawMatches = text.matchAll(compiledRegExp);
        for (const match of rawMatches) {
            text = text.replace(match[0], '');
            matches.push(cleanMatch(match, excludeCaptureGroups));
        }
        return text;
    }
    return text;
}
/**
 * @param commandName - A simple LaTeX macro / command name
 *   from example: `emph` `\emph{.*}`
 */
function texReg(commandName) {
    return new RegExp(regBuilder.cmd(commandName), 'g');
}
/**
 * @param commandName - A simple LaTeX macro / command name
 *   from example: `emph` `\emph{.*}`
 */
function texRep(commandName) {
    return `\\${commandName}{$1}`;
}
/**
 *
 * @param tagName - The name of the HTML tag (for example “em”).
 * @param className - The name of the CSS class (for example “person”).
 */
function mdReg(tagName, className = '') {
    let classMarkup = '';
    if (className != null) {
        classMarkup = ` class="${className}"`;
    }
    return new RegExp('<' + tagName + classMarkup + '>([^<>]+?)</' + tagName + '>', 'g');
}
/**
 * @param tagName - The name of the HTML tag (for example “em”).
 * @param className - The name of the CSS class (for example “person”).
 */
function mdRep(tagName, className = '') {
    let classMarkup = '';
    if (className != null) {
        classMarkup = ` class="${className}"`;
    }
    return `<${tagName}${classMarkup}>$1</${tagName}>`;
}
/**
 * @param texCommandName
 * @param htmlTagName
 * @param htmlClassName
 */
function semanticSpec(texCommandName, htmlTagName, htmlClassName) {
    return [{
            tex: { reg: texReg(texCommandName), rep: texRep(texCommandName) },
            md: { reg: mdReg(htmlTagName, htmlClassName), rep: mdRep(htmlTagName, htmlClassName) }
        }];
}
/**
 * The specification of the replacements.
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
    { tex: '---', md: '—' },
    { tex: '--', md: '–' },
    { tex: { reg: /\\pfeil\{?\}?/g, rep: '\\pfeil{}' }, md: '->' },
    { tex: '"emph"', md: '"em"' },
    { tex: '"textbf"', md: '"strong"' },
    { tex: '"textit"', md: '"i"' },
    {
        tex: { reg: texReg('section'), rep: texRep('section') },
        md: { reg: /# (.*)\n/g, rep: '# $1' }
    },
    {
        tex: { reg: texReg('subsection'), rep: texRep('subsection') },
        md: { reg: /## (.*)\n/g, rep: '## $1' }
    },
    {
        tex: { reg: texReg('subsubsection'), rep: texRep('subsubsection') },
        md: { reg: /### (.*)\n/g, rep: '### $1' }
    }
];
/**
 *
 * @param {string} text - A input string to convert.
 *
 * @see {@link https://tex.stackexchange.com/a/451849/42311}
 */
export function removeTexComments(text) {
    // TeX comment to fix hyphenation
    // Lorem ip-%
    // sum
    text = text.replace(/%\n\s*/g, '');
    // Lookbehinds not working in Firefox
    // text = text.replace(/(?<!\\)%.*/g, '')
    text = text.replace(/%.*/g, '');
    return text;
}
/**
 * @param {string} text - A input string to convert.
 */
function removeTexHeaderFooter(text) {
    // Remove TeX header and footer
    text = text.replace(/[^]*\\begin\{document\}/, '');
    text = text.replace(/\\end\{document\}[^]*/, '');
    return text;
}
/**
 * @param text - A input string to convert.
 */
function convertTexItemize(text) {
    return text.replace(/\\begin\{(compactitem|itemize)\}([^]+?)\\end\{(compactitem|itemize)\}/g, function (match, p1, p2) {
        let text = p2;
        // \item Lorem -> - Lorem
        text = text.replace(/\\item\s*/g, '- ');
        // No empty lines
        text = text.replace(/\n\n/g, '\n');
        text = text.replace(/\n(\w|-> )/g, '\n  $1');
        return text;
    });
}
/**
 *
 * @param text - A input string to convert.
 */
function cleanUpTex(text) {
    // Delete comments
    text = text.replace(/\n%.*?\n/g, '\n');
    text = text.replace(/\n%.*?\n/g, '\n');
    // Delete \-
    text = text.replace(/\\-/g, '');
    // Left TeX commands
    text = text.replace(/\\\w+\{?.*\}?/g, '');
    return text;
}
/**
 *
 * @param text - A input string to convert.
 *
 * @returns A cleaned up string.
 */
function cleanUp(text) {
    text = text.replace(/\n\n\n+/g, '\n\n');
    return text;
}
/**
 * Convert a text input from TeX to Markdown or from Markdown to TeX.
 *
 * @param text - The text input.
 * @param toTex - True to convert from Markdown to TeX. False to
 *   convert from TeX to Markdown.
 */
function convert(text, toTex) {
    const specsReq = [];
    const specsRep = [];
    for (const spec of specification) {
        if (!toTex) {
            specsReq.push(spec.tex);
            specsRep.push(spec.md);
        }
        else {
            specsReq.push(spec.md);
            specsRep.push(spec.tex);
        }
    }
    for (let i = 0; i < specification.length; i++) {
        let reg = null;
        let rep = null;
        const specReg = specsReq[i];
        const specRep = specsRep[i];
        // reg regexp regular expression
        if (typeof specReg === 'string') {
            if (specReg.charAt(0) === '"') {
                // "em" -> em
                const markupName = specReg.substr(1, specReg.length - 2);
                reg = !toTex ? texReg(markupName) : mdReg(markupName);
            }
            else {
                reg = new RegExp(specReg, 'g');
            }
        }
        else if (specReg instanceof RegExp) {
            reg = specReg;
        }
        else if (typeof specReg === 'object') {
            reg = specReg.reg;
        }
        // rep replacement
        if (typeof specRep === 'string') {
            if (specRep.charAt(0) === '"') {
                rep = mdRep(specRep.substr(1, specRep.length - 2));
            }
            else {
                rep = specRep;
            }
        }
        else if (typeof specRep === 'object') {
            rep = specRep.rep;
        }
        if (reg != null && rep != null) {
            text = text.replace(reg, rep);
        }
    }
    return text;
}
/**
 * Convert an TeX text to a Markdown text.
 *
 * @param text An input text in the TeX format.
 *
 * @returns A string in the Markdown format.
 */
export function convertTexToMd(text) {
    text = removeTexHeaderFooter(text);
    text = convertTexZitat(text);
    text = convertTexItemize(text);
    text = convert(text, false);
    text = cleanUpTex(text);
    text = cleanUp(text);
    return text;
}
/**
 * Convert an Markdown text to a TeX text.
 *
 * @param text An input text in the Markdown format.
 *
 * @returns A string in the TeX format.
 */
export function convertMdToTex(text) {
    return convert(text, true);
}
function convertToOneLineMd(content) {
    content = removeTexComments(content);
    content = content.replace(/\n/g, ' ');
    content = content.replace(/\s\s+/g, ' ');
    content = content.trim();
    // [\\person{Erasmus von Rotterdam}
    content = content.replace(/^\[/, '');
    content = content.replace(/\]$/, '');
    return convertTexToMd(content);
}
/**
 *
 * @param content A TeX string.
 */
export function objectifyTexZitat(content) {
    const regexp = new RegExp(regBuilder.env('zitat', '\\*?' + regBuilder.captDotAll), 'g');
    const matches = content.matchAll(regexp);
    const data = [];
    for (const match of matches) {
        let text = match[1];
        const regOpt = /^[^]+\]/;
        const optional = text.match(regOpt);
        let optionalString = '';
        if (optional != null) {
            optionalString = optional[0];
            text = text.replace(regOpt, '');
        }
        text = convertToOneLineMd(text);
        const item = {
            quote: {
                text
            }
        };
        if (optionalString != null) {
            // [\person{Bischof Bernardino Cirillo}][1549]
            // [\person{Martin Luther}]
            const segments = optionalString.split('][');
            if (segments.length > 1) {
                item.quote.author = convertToOneLineMd(segments[0]);
                item.quote.date = convertToOneLineMd(segments[1]);
            }
            else {
                item.quote.author = convertToOneLineMd(segments[0]);
            }
        }
        data.push(item);
    }
    return data;
}
function convertTexZitat(content) {
    const zitate = objectifyTexZitat(content);
    if (zitate.length > 0) {
        return convertToYaml(zitate);
    }
    return content;
}
export function objectifyTexItemize(content) {
    const regSection = regBuilder.cmd('(sub)?(sub)?section', '([^\\}]*?)');
    const regItemize = regBuilder.env('(compactitem|itemize)');
    const matches = [];
    const exclude = ['itemize', 'compactitem', 'sub'];
    for (const regex of [
        regSection + regBuilder.whiteNewline + regSection + regBuilder.whiteNewline + regItemize,
        regSection + regBuilder.whiteNewline + regItemize,
        regItemize
    ]) {
        content = extractMatchAll(content, regex, matches, exclude);
    }
    const data = [];
    for (const match of matches) {
        const itemsText = match.pop();
        if (itemsText != null) {
            const sections = match;
            const item = {};
            const items = [];
            for (const itemText of itemsText.split('\\item')) {
                const oneLine = convertToOneLineMd(itemText);
                if (oneLine != null)
                    items.push(oneLine);
            }
            if (sections.length > 0)
                item.sections = sections;
            item.items = items;
            data.push(item);
        }
    }
    return data;
}
export default {
    regBuilder,
    cleanMatch,
    extractMatchAll,
    removeComments: removeTexComments
};
