/**
 * Base core functionality for the code running in the browser without node.
 *
 * Run `npm run build` to build the node version of this code. The node
 * version uses the CommonJS module system instead of the ES module system.
 *
 * @module @bldr/core-browser-ts
 */

/**
 * Get the extension from a file path.
 *
 * @param {String} filePath - A file path or a single file name.
 *
 * @returns {String} - The extension in lower case characters.
 */
export function getExtension (filePath: string): string | undefined {
  if (filePath) {
    const extension = String(filePath).split('.').pop()
    if (extension) {
      return extension.toLowerCase()
    }
  }
}
