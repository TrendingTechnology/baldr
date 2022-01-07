"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.score = void 0;
const core_node_1 = require("@bldr/core-node");
/**
 * The meta data type specification “score”.
 */
exports.score = {
    title: 'Partitur',
    abbreviation: 'PT',
    detectCategoryByPath: new RegExp('^.*/PT/.*.(pdf|svg|png)$'),
    props: {
        composer: {
            title: 'Komponist'
        },
        imslpWorkId: {
            title: 'IMSLP-Werk-ID',
            description: 'Z. B.: The_Firebird_(Stravinsky,_Igor)'
        },
        imslpScoreId: {
            title: 'IMSLP Partitur-ID',
            description: 'Z. B.: PMLP179424-PMLUS00570-Complete_Score_1.pdf'
        },
        publisher: {
            title: 'Verlag'
        },
        pageCount: {
            title: 'Seitenanzahl des PDFs',
            description: 'Die Seitenanzahl dieses PDFs',
            derive({ filePath }) {
                if (filePath != null && filePath.match(/\.pdf$/gi)) {
                    return (0, core_node_1.getPdfPageCount)(filePath);
                }
            },
            overwriteByDerived: true
        }
    }
};
