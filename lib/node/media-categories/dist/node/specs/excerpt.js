"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.excerpt = void 0;
/**
 * The meta data type specification “excerpt”.
 */
exports.excerpt = {
    title: 'Ausschnitt',
    props: {
        excerptStartTime: {
            title: 'Startzeitpunkt des Ausschnitts',
            description: 'Nicht zu verwechseln mit der Sample-Eigenschaft `startTime`'
        },
        excerptEndTime: {
            title: 'Endzeitpunkt des Ausschnitts',
            description: 'Nicht zu verwechseln mit der Sample-Eigenschaft `endTime`'
        }
    }
};
