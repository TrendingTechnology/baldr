"use strict";
const main_js_1 = require("../../main.js");
module.exports = (0, main_js_1.validateDefintion)({
    command: 'rename [files...]',
    alias: 'r',
    description: [
        'Rename and clean file names, remove all whitespaces and special characters.',
        'For example:',
        '“Heimat Games - Titelmusik.mp3” -> “Heimat-Games_Titelmusik.mp3”',
        '“Götterdämmerung.mp3” -> “Goetterdaemmerung.mp3”'
    ].join(' ')
});
