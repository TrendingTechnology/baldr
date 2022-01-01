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
export function mapStepFieldDefintions(selectors) {
    const result = {};
    for (const selector of selectors) {
        if (stepFieldDefinitions[selector] != null) {
            result[`step${selector.charAt(0).toUpperCase()}${selector
                .substr(1)
                .toLowerCase()}`] = stepFieldDefinitions[selector];
        }
    }
    return result;
}
/**
 * Map step support related fields.
 *
 * @param selectors - At the moment: “selector”, “mode” and “subset”.
 *
 * @returns should return `PropsDefinition<DefaultProps>`
 */
export function mapStepFieldDefintionsToProps(selectors) {
    const result = {};
    for (const selector of selectors) {
        if (stepFieldDefinitions[selector] != null) {
            result[`step${selector.charAt(0).toUpperCase()}${selector
                .substr(1)
                .toLowerCase()}`] = stepFieldDefinitions[selector];
        }
    }
    return result;
}
