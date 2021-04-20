"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cover = void 0;
/**
 * The meta data type specification “cover”.
 */
exports.cover = {
    title: 'Vorschau-Bild',
    detectCategoryByPath: new RegExp('^.*/HB/.*(png|jpg)$'),
    props: {
        title: {
            title: 'Titel',
            format: function (value) {
                return value.replace(/^(Cover-Bild: )?/, 'Cover-Bild: ');
            }
        },
        source: {
            title: 'Quelle (HTTP-URL)',
            validate(value) {
                return value.match(/^https?.*$/);
            }
        }
    }
};
