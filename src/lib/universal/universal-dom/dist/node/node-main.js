"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentU = exports.DOMParserU = void 0;
const jsdom_1 = require("jsdom");
const window = new jsdom_1.JSDOM().window;
const DOMParser = window.DOMParser;
exports.DOMParserU = DOMParser;
exports.documentU = window.document;
