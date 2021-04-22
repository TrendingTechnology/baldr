"use strict";
const main_js_1 = require("../../main.js");
module.exports = main_js_1.validateDefintion({
    command: 'cover-downloader [files...]',
    alias: 'cd',
    description: 'Download the cover _preview.jpg. The meta data info file must have a key named cover_source.'
});
