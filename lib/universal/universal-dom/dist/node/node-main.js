"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.locationU = exports.documentU = exports.DOMParserU = void 0;
const jsdom_1 = require("jsdom");
const window = new jsdom_1.JSDOM('', { url: 'http://localhost' }).window;
const DOMParser = window.DOMParser;
exports.DOMParserU = DOMParser;
exports.documentU = window.document;
exports.locationU = window.location;
