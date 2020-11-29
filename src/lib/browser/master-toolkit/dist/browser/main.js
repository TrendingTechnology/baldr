/**
 * Validate the master specification. This function doesn’t change the
 * the input object. The input object is passed through unchanged. The
 * validation handles Typescript.
 *
 * @param masterSpec The specification of the master slide.
 *
 * @returns The unchanged object of the specification.
 */
export function validateMasterSpec(masterSpec) {
    return masterSpec;
}
/**
 * Map step support related props for the use as Vuejs props.
 */
export function mapStepProps(selectors) {
    const props = {
        selector: {
            description: 'Selektor, der Elemente auswählt, die als Schritte eingeblendet werden sollen. „none“ deaktiviert die Unterstützung für Schritte.',
            default: 'g[inkscape\\:groupmode="layer"]'
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
    const result = {};
    for (const selector of selectors) {
        if (props[selector]) {
            result[`step${selector.charAt(0).toUpperCase()}${selector.substr(1).toLowerCase()}`] = props[selector];
        }
    }
    return result;
}
