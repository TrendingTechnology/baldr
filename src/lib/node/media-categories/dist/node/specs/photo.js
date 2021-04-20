"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.photo = void 0;
/**
 * The meta data type specification “photo”.
 */
exports.photo = {
    title: 'Foto',
    abbreviation: 'FT',
    detectCategoryByPath: function () {
        return new RegExp('^.*/FT/.*.jpg$');
    },
    props: {
        photographer: {
            title: 'Fotograph*in'
        }
    }
};
