import { mapStepFieldDefintions, convertMarkdownToHtml } from '../master-specification';
export const PLACEHOLDER = '…';
const PLACEHOLDER_TAG = `<span class="editor-placeholder">${PLACEHOLDER}</span>`;
export const DEFAULT_MARKUP = `<p contenteditable>${PLACEHOLDER_TAG}</p>`;
export class EditorMaster {
    constructor() {
        this.name = 'editor';
        this.displayName = 'Hefteintrag';
        this.icon = {
            name: 'master-editor',
            color: 'blue',
            /**
             * U+1F4DD
             *
             * @see https://emojipedia.org/memo/
             */
            unicodeSymbol: '📝'
        };
        this.fieldsDefintion = Object.assign({ markup: {
                type: String,
                markup: true,
                description: 'Text im HTML oder Markdown Format oder natürlich als reiner Text.'
            } }, mapStepFieldDefintions(['mode', 'subset']));
    }
    normalizeFieldsInput(fields) {
        if (typeof fields === 'string') {
            fields = {
                markup: fields
            };
        }
        fields.markup = convertMarkdownToHtml(fields.markup);
        fields.markup = fields.markup.replace(/>…</g, ` contenteditable>${PLACEHOLDER_TAG}<`);
        return fields;
    }
}
