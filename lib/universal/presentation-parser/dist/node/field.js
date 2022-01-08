"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapStepFieldDefintionsToProps = exports.mapStepFieldDefintions = void 0;
const string_format_1 = require("@bldr/string-format");
const stepFieldDefinitions = {
    selector: {
        type: String,
        description: 'Selektor, der Elemente auswählt, die als Schritte eingeblendet werden sollen.'
    },
    mode: {
        type: String,
        description: '„words“ oder „sentences“'
    },
    subset: {
        type: String,
        description: 'Eine Untermenge von Schritten auswählen (z. B. 1,3,5 oder 2-5).'
    }
};
/**
 * Map step support related fields.
 *
 * @param selectors - At the moment: “selector”, “mode” and “subset”.
 */
function mapStepFieldDefintions(selectors) {
    const result = {};
    for (const selector of selectors) {
        if (stepFieldDefinitions[selector] != null) {
            result[`step${(0, string_format_1.capitalize)(selector)}`] = stepFieldDefinitions[selector];
        }
    }
    return result;
}
exports.mapStepFieldDefintions = mapStepFieldDefintions;
/**
 * Map step support related fields.
 *
 * @param selectors - At the moment: “selector”, “mode” and “subset”.
 *
 * @returns should return `PropsDefinition<DefaultProps>`
 */
function mapStepFieldDefintionsToProps(selectors) {
    const result = {};
    for (const selector of selectors) {
        if (stepFieldDefinitions[selector] != null) {
            result[`step${(0, string_format_1.capitalize)(selector)}`] = stepFieldDefinitions[selector];
        }
    }
    return result;
}
exports.mapStepFieldDefintionsToProps = mapStepFieldDefintionsToProps;
