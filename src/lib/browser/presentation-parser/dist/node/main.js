"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const presentation_1 = require("./presentation");
function parse(yamlString) {
    return new presentation_1.Presentation(yamlString);
}
exports.parse = parse;
