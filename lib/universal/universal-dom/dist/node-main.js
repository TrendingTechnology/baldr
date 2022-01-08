import { JSDOM } from 'jsdom';
const window = new JSDOM('', { url: 'http://localhost' }).window;
const DOMParser = window.DOMParser;
export const DOMParserU = DOMParser;
export const documentU = window.document;
export const locationU = window.location;
