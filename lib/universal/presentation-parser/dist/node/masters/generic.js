"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericMaster = exports.splitMarkup = void 0;
const string_format_1 = require("@bldr/string-format");
const master_specification_1 = require("../master-specification");
const CHARACTERS_ON_SLIDE = 400;
function splitMarkup(rawMarkup, charactersOnSlide) {
    if (typeof rawMarkup === 'string') {
        rawMarkup = [rawMarkup];
    }
    // Convert into HTML
    const converted = [];
    for (const markup of rawMarkup) {
        converted.push((0, master_specification_1.convertMarkdownToHtml)(markup));
    }
    // Split by <hr>
    const splittedByHr = [];
    for (const html of converted) {
        if (html.indexOf('<hr>') > -1) {
            const chunks = html.split('<hr>');
            for (const chunk of chunks) {
                splittedByHr.push(chunk.trim());
            }
        }
        else {
            splittedByHr.push(html);
        }
    }
    // Split large texts into smaller chunks
    let markup = [];
    for (const html of splittedByHr) {
        const chunks = (0, master_specification_1.splitHtmlIntoChunks)(html, charactersOnSlide);
        for (const chunk of chunks) {
            markup.push(chunk);
        }
    }
    return markup;
}
exports.splitMarkup = splitMarkup;
class GenericMaster {
    constructor() {
        this.name = 'generic';
        this.displayName = 'Folie';
        this.icon = {
            name: 'file-presentation-box',
            color: 'gray',
            showOnSlides: false,
            /**
             * U+1F4C4
             *
             * @see https://emojipedia.org/page-facing-up/
             */
            unicodeSymbol: '📄'
        };
        this.fieldsDefintion = {
            markup: {
                required: true,
                // It is complicated to convert to prop based markup conversion.
                // markup: true
                inlineMarkup: true,
                description: 'Markup im HTML oder Markdown-Format'
            },
            charactersOnSlide: {
                type: Number,
                description: 'Gibt an wie viele Zeichen auf einer Folie erscheinen sollen.',
                default: CHARACTERS_ON_SLIDE
            },
            onOne: {
                description: 'Der ganze Text erscheint auf einer Folien. Keine automatischen Folienumbrüche.',
                type: Boolean,
                default: false
            }
        };
    }
    normalizeFieldsInput(fields) {
        if (typeof fields === 'string' || Array.isArray(fields)) {
            fields = { markup: fields };
        }
        return fields;
    }
    collectFieldsOnInstantiation(fields) {
        fields.markup = splitMarkup(fields.markup, fields.charactersOnSlide);
        return fields;
    }
    collectStepsOnInstantiation(fields, stepCollector) {
        for (const markup of fields.markup) {
            stepCollector.add((0, string_format_1.shortenText)(markup, { stripTags: true, maxLength: 40 }));
        }
    }
}
exports.GenericMaster = GenericMaster;
