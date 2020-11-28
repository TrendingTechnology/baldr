/**
 * @module @bldr/lamp/masters/generic
 */
import { MasterTypes } from '@bldr/type-definitions';
import { convertHtmlToPlainText } from '@bldr/core-browser';
import { convertMarkdownStringToHTML } from '@bldr/markdown-to-html';
// import steps from '@/steps.js'
// Do not remove this lines. The comments are removed by the build script.
///-/ const { JSDOM } = require('jsdom')
///-/ const DOMParser = new JSDOM().window.DOMParser
const CHARACTERS_ON_SLIDE = 400;
/**
 * Split a HTML text into smaller chunks by looping over the children.
 */
function splitHtmlintoChunks(htmlString, charactersOnSlide) {
    /**
     * Add text to the chunks array. Add only text with real letters not with
     * whitespaces.
     */
    function addText(chunks, text) {
        if (text && !text.match(/^\s*$/)) {
            chunks.push(text);
        }
    }
    if (!charactersOnSlide)
        charactersOnSlide = CHARACTERS_ON_SLIDE;
    if (htmlString.length < charactersOnSlide)
        return [htmlString];
    const domParser = new DOMParser();
    let dom = domParser.parseFromString(htmlString, 'text/html');
    // If htmlString is a text without tags
    if (!dom.body.children.length) {
        dom = domParser.parseFromString(`<p>${htmlString}</p>`, 'text/html');
    }
    let text = '';
    const chunks = [];
    // childNodes not children!
    for (const children of dom.body.childNodes) {
        // If htmlString is a text with inner tags
        if (children.nodeName === '#text') {
            text += children.textContent;
        }
        else {
            const element = children;
            text += element.outerHTML;
        }
        if (text.length > charactersOnSlide) {
            addText(chunks, text);
            text = '';
        }
    }
    // Add last not full text
    addText(chunks, text);
    return chunks;
}
// function adjustSlideSize (rootElement, wrapperElement) {
//   let size = 1
//   const rootWidth = rootElement.clientWidth
//   const rootHeight = rootElement.clientHeight
//   let wrapperRect, wrapperWidth, wrapperHeight
//   do {
//     wrapperRect = wrapperElement.getBoundingClientRect()
//     wrapperWidth = wrapperRect.width
//     wrapperHeight = wrapperRect.height
//     rootElement.style.fontSize = `${size}em`
//     size += 0.2
//   } while (rootWidth > wrapperWidth * 1.5 && rootHeight > wrapperHeight * 1.5)
//   rootElement.style.fontSize = `${size - 0.2}em`
// }
export default MasterTypes.validateMasterSpec({
    name: 'generic',
    title: 'Folie',
    propsDef: {
        markup: {
            type: [String, Array],
            required: true,
            // It is complicated to convert to prop based markup conversion.
            // markup: true
            inlineMarkup: true,
            description: 'Markup im HTML oder Markdown-Format'
        },
        charactersOnSlide: {
            type: Number,
            description: 'Gibt an wie viele Zeichen auf einer Folie erscheinen sollen.',
            default: CHARACTERS_ON_SLIDE
        },
        onOne: {
            description: 'Der ganze Text erscheint auf einer Folien. Keine automatischen Folienumbrüche.',
            type: Boolean,
            default: false
        }
        //...steps.mapProps(['mode', 'subset'])
    },
    icon: {
        name: 'file-presentation-box',
        color: 'gray',
        showOnSlides: false
    },
    styleConfig: {
        centerVertically: true,
        darkMode: false
    },
    hooks: {
        normalizeProps(props) {
            if (typeof props === 'string' || Array.isArray(props)) {
                props = {
                    markup: props
                };
            }
            if (typeof props.markup === 'string') {
                props.markup = [props.markup];
            }
            // Convert into HTML
            const converted = [];
            for (const markup of props.markup) {
                converted.push(convertMarkdownStringToHTML(markup));
            }
            // Split by <hr>
            const splittedByHr = [];
            for (const html of converted) {
                if (html.indexOf('<hr>') > -1) {
                    const chunks = html.split('<hr>');
                    for (const chunk of chunks) {
                        splittedByHr.push(chunk);
                    }
                }
                else {
                    splittedByHr.push(html);
                }
            }
            // Split large texts into smaller chunks
            let markup = [];
            for (const html of splittedByHr) {
                const chunks = splitHtmlintoChunks(html, props.charactersOnSlide);
                for (const chunk of chunks) {
                    markup.push(chunk);
                }
            }
            if (props.onOne) {
                markup = [markup.join(' ')];
            }
            if (props.stepMode && props.stepMode === 'words') {
                //props.markup = [steps.wrapWords(markup.join(' '))]
            }
            else {
                props.markup = markup;
            }
            return props;
        },
        collectPropsPreview({ props }) {
            return {
                markup: props.markup[0]
            };
        },
        // calculateStepCount ({ props }) {
        //   if (props.stepMode) {
        //     return steps.calculateStepCountText(props.markup, props)
        //   } else {
        //     return props.markup.length
        //   }
        // },
        plainTextFromProps(props) {
            const output = [];
            for (const markup of props.markup) {
                output.push(convertHtmlToPlainText(markup));
            }
            return output.join(' | ');
        },
    }
});
