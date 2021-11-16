"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WordSelector = exports.ClozeSelector = exports.InkscapeSelector = exports.ElementSelector = void 0;
const universal_dom_1 = require("@bldr/universal-dom");
const step_1 = require("./step");
class Selector {
    constructor(entry) {
        if (typeof entry === 'string') {
            // Cloze-SVG:
            // <?xml version="1.0" encoding="UTF-8"?>
            // <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 595.276 841.89" version="1.1">
            // <defs>
            // Inkscape-SVG:
            // <?xml version="1.0" encoding="UTF-8" standalone="no"?>
            // <svg
            //    xmlns:dc="http://purl.org/dc/elements/1.1/"
            //    xmlns:cc="http://creativecommons.org/ns#"
            //    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
            //    xmlns:svg="http://www.w3.org/2000/svg"
            //    xmlns="http://www.w3.org/2000/svg"
            //    xmlns:xlink="http://www.w3.org/1999/xlink"
            //    id="svg8"
            //    version="1.1"
            //    viewBox="0 0 169.17574 95.783676">
            let type = 'text/html';
            if (entry.indexOf('<?xml') === 0) {
                type = 'image/svg+xml';
            }
            const dom = new universal_dom_1.DOMParserU().parseFromString(entry, type);
            this.rootElement = dom.documentElement;
        }
        else {
            this.rootElement = entry;
        }
    }
    count() {
        // Assumes that all elements are hidden for the first step.
        return this.select().length + 1;
    }
    createStep(...htmlElements) {
        return new step_1.StepElement(htmlElements, true);
    }
}
class ElementSelector extends Selector {
    /**
     * @param entry - A string that can be translated to a DOM using the DOMParser
     *   or a HTML element as an entry to the DOM.
     * @param selectors - A string to feed `document.querySelectorAll()`.
     */
    constructor(entry, selectors) {
        super(entry);
        this.selectors = selectors;
    }
    select() {
        const result = [];
        const nodeList = this.rootElement.querySelectorAll(this.selectors);
        for (const element of nodeList) {
            result.push(this.createStep(element));
        }
        return result;
    }
}
exports.ElementSelector = ElementSelector;
class InkscapeSelector extends Selector {
    constructor(entry, mode = 'layer') {
        super(entry);
        this.mode = mode;
    }
    getLayerElements(rootElement, mode) {
        const layers = rootElement.querySelectorAll('g');
        const result = [];
        for (const layer of layers) {
            if (mode !== 'group') {
                const attribute = layer.attributes.getNamedItem('inkscape:groupmode');
                if (attribute != null && attribute.nodeValue === 'layer') {
                    result.push(layer);
                }
            }
            else {
                result.push(layer);
            }
        }
        return result;
    }
    select() {
        const layers = this.getLayerElements(this.rootElement, this.mode);
        const result = [];
        if (this.mode === 'layer+') {
            for (const layer of layers) {
                for (let index = 0; index < layer.children.length; index++) {
                    const c = layer.children.item(index);
                    if (c == null) {
                        throw new Error('SVG child layer selection failed');
                    }
                    const child = c;
                    if (index === 0) {
                        result.push(new step_1.StepElement([layer, child], false));
                    }
                    else {
                        result.push(new step_1.StepElement(child, false));
                    }
                }
            }
        }
        else if (this.mode === 'layer' || this.mode === 'group') {
            for (const layer of layers) {
                result.push(new step_1.StepElement(layer, false));
            }
        }
        return result;
    }
}
exports.InkscapeSelector = InkscapeSelector;
class ClozeSelector extends Selector {
    select() {
        const groups = this.rootElement.querySelectorAll('svg g');
        const clozeGElements = [];
        for (const group of groups) {
            // JSDOM: rgb(0%,0%,100%)
            if (group.style.fill === 'rgb(0, 0, 255)' ||
                group.style.fill === 'rgb(0%,0%,100%)') {
                clozeGElements.push(new step_1.StepElement(group));
            }
        }
        return clozeGElements;
    }
}
exports.ClozeSelector = ClozeSelector;
/**
 * Select words which are surrounded by `span.word`.
 */
class WordSelector extends Selector {
    select() {
        const wordsRaw = this.rootElement.querySelectorAll('span.word');
        const words = [];
        for (const word of wordsRaw) {
            if (word.previousSibling == null) {
                const parent = word.parentElement;
                if (parent != null && parent.tagName === 'LI') {
                    if (parent.previousSibling == null && parent.parentElement != null) {
                        // <ul><li><span class="word">lol</span><li></ul>
                        words.push(new step_1.StepElement([parent.parentElement, parent, word], true));
                    }
                    else {
                        // Avoid to get divs. Parent has to be LI
                        words.push(new step_1.StepElement([parent, word], true));
                    }
                }
                else {
                    words.push(new step_1.StepElement(word, true));
                }
            }
            else {
                words.push(new step_1.StepElement(word, true));
            }
        }
        return words;
    }
}
exports.WordSelector = WordSelector;
