import { JSDOM } from 'jsdom'

const window = new JSDOM().window
const DOMParser = window.DOMParser

export const DOMParserU = DOMParser

export const documentU = window.document
