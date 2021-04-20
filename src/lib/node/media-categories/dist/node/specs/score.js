"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.score = void 0;
/**
 * The meta data type specification “score”.
 */
exports.score = {
    title: 'Partitur',
    abbreviation: 'PT',
    detectCategoryByPath: function () {
        return new RegExp('^.*/PT/.*.pdf$');
    },
    props: {
        imslpWorkId: {
            title: 'IMSLP-Werk-ID',
            description: 'Z. B.: The_Firebird_(Stravinsky,_Igor)'
        },
        imslpScoreId: {
            title: 'IMSLP Partitur-ID: z. B. PMLP179424-PMLUS00570-Complete_Score_1.pdf'
        },
        publisher: {
            title: 'Verlag'
        }
    }
};
