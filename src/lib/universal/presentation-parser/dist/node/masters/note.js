"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteMaster = void 0;
const master_1 = require("../master");
const dom_manipulator_1 = require("@bldr/dom-manipulator");
class NoteMaster {
    constructor() {
        this.name = 'note';
        this.displayName = 'Hefteintrag';
        this.icon = {
            name: 'pencil',
            color: 'blue',
            /**
             * U+1F58B U+FE0F
             *
             * @see https://emojipedia.org/fountain-pen/
             */
            unicodeSymbol: '🖋️'
        };
        this.fieldsDefintion = {
            markup: {
                type: String,
                markup: true,
                description: 'Text im HTML- oder Markdown-Format oder als reiner Text.'
            }
        };
        this.shortFormField = 'markup';
    }
    normalizeFieldsInput(fields) {
        fields.markup = master_1.convertMarkdownToHtml(fields.markup);
        // hr tag
        if (fields.markup.indexOf('<hr>') > -1) {
            const segments = fields.markup.split('<hr>');
            const prolog = segments.shift();
            let body = segments.join('<hr>');
            body = '<span class="word-area">' + dom_manipulator_1.wrapWords(body) + '</span>';
            fields.markup = [prolog, body].join('');
            // No hr tag provided
            // Step through all words
        }
        else {
            fields.markup = dom_manipulator_1.wrapWords(fields.markup);
        }
        return fields;
    }
    collectStepsOnInstantiation(fields, stepCollector) {
        const controller = dom_manipulator_1.buildTextStepController(fields.markup, {
            stepMode: 'words'
        });
        stepCollector.add('Initiale Ansicht');
        for (const stepElement of controller.steps) {
            if (stepElement.text == null) {
                throw new Error('A step in the master slide “note” needs text!');
            }
            stepCollector.add(stepElement.text);
        }
    }
}
exports.NoteMaster = NoteMaster;
