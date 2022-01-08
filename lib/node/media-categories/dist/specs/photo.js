/**
 * The meta data type specification “photo”.
 */
export const photo = {
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
