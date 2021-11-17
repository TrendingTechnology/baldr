"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentenceSelector = exports.WordSelector = exports.ClozeSelector = exports.InkscapeSelector = exports.ElementSelector = void 0;
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
        return new step_1.StepElement(htmlElements);
    }
    createVanishStep(...htmlElements) {
        return new step_1.StepElement(htmlElements, false);
    }
    static collectStepTexts(steps) {
        const result = [];
        for (const step of steps) {
            if (step.text != null) {
                result.push(step.text);
            }
        }
        return result;
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
                        result.push(new step_1.StepElement([layer, child]));
                    }
                    else {
                        result.push(new step_1.StepElement(child));
                    }
                }
            }
        }
        else if (this.mode === 'layer' || this.mode === 'group') {
            for (const layer of layers) {
                result.push(new step_1.StepElement(layer));
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
        const words = this.rootElement.querySelectorAll('span.word');
        const steps = [];
        for (const word of words) {
            if (this.isFirstListWord(word)) {
                steps.push(this.createStepWithGrandpa(word));
            }
            else if (this.isFirstListItemWord(word)) {
                steps.push(this.createStepWithDad(word));
            }
            else if (this.isHeadingWord(word)) {
                steps.push(this.createHeadingStep(word));
            }
            else {
                steps.push(new step_1.StepElement(word));
            }
        }
        return steps;
    }
    /**
     * `<ul><li><span class="word">First</span> <span class="word">Second</span> <li></ul>`
     */
    isInList(kid) {
        const dad = kid.parentElement;
        const grandpa = dad != null ? dad.parentElement : null;
        return (dad != null &&
            grandpa != null &&
            dad.tagName === 'LI' &&
            (grandpa.tagName === 'OL' || grandpa.tagName === 'UL'));
    }
    /**
     * `<ul><li><span class="word">First</span><li></ul>`
     */
    isFirstListWord(kid) {
        const dad = kid.parentElement;
        return (this.isInList(kid) &&
            kid.previousSibling == null &&
            (dad === null || dad === void 0 ? void 0 : dad.previousSibling) == null);
    }
    /**
     * `<li><span class="word">First</span><li>`
     */
    isFirstListItemWord(kid) {
        const dad = kid.parentElement;
        return (this.isInList(kid) &&
            kid.previousSibling == null &&
            (dad === null || dad === void 0 ? void 0 : dad.previousSibling) != null);
    }
    isHeadingWord(kid) {
        const dad = kid.parentElement;
        if (dad == null) {
            return false;
        }
        return (dad.tagName === 'H1' ||
            dad.tagName === 'H2' ||
            dad.tagName === 'H3' ||
            dad.tagName === 'H4' ||
            dad.tagName === 'H5' ||
            dad.tagName === 'H6');
    }
    createStepWithGrandpa(kid) {
        if (kid.parentElement == null || kid.parentElement.parentElement == null) {
            throw new Error('kid element must have a dad and grandpa element');
        }
        return new step_1.StepElement([
            kid.parentElement.parentElement,
            kid.parentElement,
            kid
        ]);
    }
    createStepWithDad(kid) {
        if (kid.parentElement == null) {
            throw new Error('kid element must have a dad element');
        }
        return new step_1.StepElement([kid.parentElement, kid]);
    }
    createHeadingStep(kid) {
        if (kid.parentElement == null) {
            throw new Error('kid element must have a dad and grandpa element');
        }
        const dad = kid.parentElement;
        const step = this.createStep(kid);
        if (kid.previousSibling == null) {
            step.onShow = () => {
                dad.style.textDecoration = 'none';
            };
            step.onHide = () => {
                dad.style.textDecoration = 'underline';
            };
        }
        else if (kid.nextSibling == null) {
            step.onShow = () => {
                dad.style.textDecoration = 'underline';
            };
            step.onHide = () => {
                dad.style.textDecoration = 'none';
            };
        }
        return step;
    }
}
exports.WordSelector = WordSelector;
/**
 * Select more than a word. The meaning  of "sentences" in the function name
 * should not be understood literally, but symbolic for a longer text unit.
 * Select a whole paragraph (`<p>`) or a heading `<h1>` or `<li>` items of
 * ordered or unordered lists, or a table row.
 */
class SentenceSelector extends Selector {
    select() {
        const sentences = [];
        for (const element of this.rootElement.children) {
            if (['UL', 'OL'].includes(element.tagName)) {
                for (const li of element.children) {
                    if (li.tagName === 'LI') {
                        sentences.push(new step_1.StepElement(li));
                    }
                }
            }
            else {
                sentences.push(new step_1.StepElement(element));
            }
        }
        return sentences;
    }
}
exports.SentenceSelector = SentenceSelector;
