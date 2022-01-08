/**
 * The meta data type specification “excerpt”.
 */
export const excerpt = {
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
