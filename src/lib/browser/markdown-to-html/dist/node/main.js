module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! flagged exports */
/*! export __esModule [provided] [maybe used in main (runtime-defined)] [usage prevents renaming] */
/*! export convertMarkdownToHtml [provided] [maybe used in main (runtime-defined)] [usage prevents renaming] */
/*! other exports [not provided] [maybe used in main (runtime-defined)] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.convertMarkdownToHtml = void 0;
const marked = __webpack_require__(/*! marked */ "marked");
///////////////
const jsdom_1 = __webpack_require__(/*! jsdom */ "jsdom");
const DOMParser = new jsdom_1.JSDOM().window.DOMParser;
//////////
/**
 * Convert some custom markup like arrows.
 *
 * @param text - The raw input text coming directly form YAML.
 */
function convertCustomMarkup(text) {
    return text
        // ↔ 8596 2194 &harr; LEFT RIGHT ARROW
        .replace(/<->/g, '↔')
        // → 8594 2192 &rarr; RIGHTWARDS ARROW
        .replace(/->/g, '→')
        // ← 8592 2190 &larr; LEFTWARDS ARROW
        .replace(/<-/g, '←');
}
/**
 * Convert a string from Markdown to HTML. Automatically generate a
 * inline version (without surrounding `<p></p>`) if the text consists
 * of only one paragraph.
 *
 * Other no so stable solution:
 * https://github.com/markedjs/marked/issues/395
 *
 * @param text - The raw input text coming directly from YAML.
 */
function convertMarkdownAutoInline(text) {
    text = marked(text);
    const dom = new DOMParser().parseFromString(text, 'text/html');
    // Solution using the browser only implementation.
    if (dom.body.childElementCount === 1 && dom.body.children[0].tagName === 'P') {
        return dom.body.children[0].innerHTML;
    }
    else {
        return dom.body.innerHTML;
    }
}
/**
 * Convert a string from the Markdown format into the HTML format.
 *
 * @param text - A string in the Markdown format.
 */
function convertMarkdown(text) {
    return convertMarkdownAutoInline(convertCustomMarkup(text));
}
/**
 * Convert Mardown texts into HTML texts.
 *
 * The conversion is done in a recursive fashion, that means in object or array
 * nested strings are also converted.
 *
 * @param input - Various input types
 */
function convertMarkdownToHtml(input) {
    // string
    if (typeof input === 'string') {
        return convertMarkdown(input);
        // array
    }
    else if (Array.isArray(input)) {
        for (let index = 0; index < input.length; index++) {
            const value = input[index];
            if (typeof value === 'string') {
                input[index] = convertMarkdown(value);
            }
            else {
                convertMarkdownToHtml(value);
            }
        }
        // object
    }
    else if (typeof input === 'object') {
        for (const key in input) {
            const value = input[key];
            if (typeof value === 'string') {
                input[key] = convertMarkdown(value);
            }
            else {
                convertMarkdownToHtml(value);
            }
        }
    }
    return input;
}
exports.convertMarkdownToHtml = convertMarkdownToHtml;


/***/ }),

/***/ "jsdom":
/*!************************!*\
  !*** external "jsdom" ***!
  \************************/
/*! dynamic exports */
/*! exports [maybe provided (runtime-defined)] [no usage info] */
/*! runtime requirements: module */
/***/ ((module) => {

module.exports = require("jsdom");;

/***/ }),

/***/ "marked":
/*!*************************!*\
  !*** external "marked" ***!
  \*************************/
/*! dynamic exports */
/*! exports [maybe provided (runtime-defined)] [no usage info] */
/*! runtime requirements: module */
/***/ ((module) => {

module.exports = require("marked");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__("./src/main.ts");
/******/ })()
;
//# sourceMappingURL=main.js.map