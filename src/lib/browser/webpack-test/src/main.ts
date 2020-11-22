// https://webpack.js.org/plugins/normal-module-replacement-plugin/

// https://github.com/nippur72/ifdef-loader

/// #if IS_NODE
import { JSDOM } from 'jsdom'

export const DOMParser = new JSDOM().window.DOMParser

export function convertMarkdown (text: string): Document {
  return new DOMParser().parseFromString(text, 'text/html')
}

console.log("Code for node!");
/// #endif

/**
 * Say Hello, World!
 */
export function helloWorld(): void {
  console.log("Hello, World!")
}

const hello = 'Hello World'

helloWorld()

export default {
  hello
}
