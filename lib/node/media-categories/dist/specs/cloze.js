import path from 'path';
/**
 * The meta data type specification “cloze”.
 */
export const cloze = {
    title: 'Lückentext',
    abbreviation: 'LT',
    detectCategoryByPath: function () {
        return new RegExp('^.*/LT/.*.svg$');
    },
    initialize({ data }) {
        const clozeData = data;
        if (clozeData.filePath != null && clozeData.clozePageNo == null) {
            const match = clozeData.filePath.match(/(\d+)\.svg/);
            if (match != null)
                clozeData.clozePageNo = parseInt(match[1]);
        }
        return data;
    },
    relPath({ data, oldRelPath }) {
        const clozeData = data;
        const oldRelDir = path.dirname(oldRelPath);
        let pageNo = '';
        if (clozeData.clozePageNo != null)
            pageNo = `_${clozeData.clozePageNo}`;
        return path.join(oldRelDir, `Lueckentext${pageNo}.svg`);
    },
    props: {
        ref: {
            title: 'Die ID des Lückentexts',
            derive: function ({ data, folderTitles }) {
                const clozeData = data;
                let counterSuffix = '';
                if (data.clozePageNo != null) {
                    counterSuffix = `_${clozeData.clozePageNo}`;
                }
                const id = folderTitles != null ? folderTitles.ref : 'lueckentext';
                return `${id}_LT${counterSuffix}`;
            },
            overwriteByDerived: true
        },
        title: {
            title: 'Titel des Lückentextes',
            derive: function ({ data, folderTitles }) {
                const clozeData = data;
                let suffix = '';
                if (clozeData.clozePageNo != null && clozeData.clozePageCount != null) {
                    suffix = ` (Seite ${clozeData.clozePageNo} von ${clozeData.clozePageCount})`;
                }
                else if (clozeData.clozePageNo != null &&
                    clozeData.clozePageCount == null) {
                    suffix = ` (Seite ${clozeData.clozePageNo})`;
                }
                if (folderTitles != null) {
                    return `Lückentext zum Thema „${folderTitles.titleAndSubtitle}“${suffix}`;
                }
                else {
                    return `Lückentext${suffix}`;
                }
            },
            overwriteByDerived: true
        },
        clozePageNo: {
            title: 'Seitenzahl des Lückentextes',
            validate(value) {
                return Number.isInteger(value);
            }
        },
        clozePageCount: {
            title: 'Seitenanzahl des Lückentextes',
            validate(value) {
                return Number.isInteger(value);
            }
        }
    }
};
