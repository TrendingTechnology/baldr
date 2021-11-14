"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOMParserU = void 0;
const jsdom_1 = require("jsdom");
const DOMParser = new jsdom_1.JSDOM().window.DOMParser;
exports.DOMParserU = DOMParser;
