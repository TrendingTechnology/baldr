"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sample = void 0;
const sampleSpecKeys = [
    'title',
    'ref',
    'startTime',
    'duration',
    'endTime',
    'fadeIn',
    'fadeOut',
    'shortcut'
];
/**
 * The meta data type specification “sample”.
 *
 * @see @bldr/type-definitions/asset.SampleYamlFormat
 */
exports.sample = {
    title: 'Audio/Video-Ausschnitt',
    props: {
        samples: {
            title: 'Ausschnitte',
            validate(value) {
                if (!Array.isArray(value)) {
                    console.log(`Samples must be an array.`);
                    return false;
                }
                for (const sampleSpec of value) {
                    for (const key in sampleSpec) {
                        if (!sampleSpecKeys.includes(key)) {
                            console.log(`Unknown sample key: ${key}`);
                            return false;
                        }
                    }
                }
                return true;
            }
        },
        startTime: {
            title: 'Startzeitpunkt des Samples'
        },
        duration: {
            title: 'Dauer des Ausschnitts'
        },
        endTime: {
            title: 'Endzeitpunkt des Samples'
        },
        fadeIn: {
            title: 'Dauer der Einblendzeit'
        },
        fadeOut: {
            title: 'Dauer der Ausblendzeit'
        }
    }
};
