// https://webpack.js.org/plugins/normal-module-replacement-plugin/

// https://github.com/nippur72/ifdef-loader

// import { JSDOM } from 'jsdom'

// export const DOMParser = new JSDOM().window.DOMParser

/// #if IS_NODE
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
