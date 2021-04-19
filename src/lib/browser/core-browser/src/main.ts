/**
 * Base core functionality for the code running in the browser without node.
 *
 * Run `npm run build` to build the node version of this code. The node
 * version uses the CommonJS module system instead of the ES module system.
 *
 * @module @bldr/core-browser
 */

export * from './media-categories'
export * from './object-manipulation'
export * from './string-format'

/**
 * Get the extension from a file path.
 *
 * @param filePath - A file path or a single file name.
 *
 * @returns The extension in lower case characters.
 */
export function getExtension (filePath: string): string | undefined {
  if (filePath != null) {
    const extension = String(filePath).split('.').pop()
    if (extension != null) {
      return extension.toLowerCase()
    }
  }
}

/**
 * A media URI with an optional fragment (subset selector).
 *
 * Possible URIs are for example:
 * `id:Rhythm-n-Blues-Rock-n-Roll_BD_Bill-Haley#complete`
 * `uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7`
 */
export class MediaUri {
  private static readonly schemes: string[] = ['id', 'uuid']

  private static readonly regExpAuthority: string = 'a-zA-Z0-9-_'

  /**
   * `#Sample1` or `#1,2,3` or `#-4`
   */
  private static readonly regExpFragment: string = MediaUri.regExpAuthority + ','

  public static regExp: RegExp = new RegExp(
    '(?<uri>' +
      '(?<scheme>' + MediaUri.schemes.join('|') + ')' +
      ':' +
      '(' +
        '(?<authority>[' + MediaUri.regExpAuthority + ']+)' +
        '(' +
          '#' +
          '(?<fragment>[' + MediaUri.regExpFragment + ']+)' +
        ')?' +
      ')' +
    ')'
  )

  /**
   * The full URI (Uniform Resource Identifier), for example
   * `uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7#2-3` or `id:Beethoven_Ludwig-van#-4`.
   */
  public uri: string

  /**
   * `id` or `uuid`
   */
  public scheme: string

  /**
   * `c262fe9b-c705-43fd-a5d4-4bb38178d9e7` or `Beethoven_Ludwig-van`.
   */
  public authority: string

  /**
   * `uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7` or `id:Beethoven_Ludwig-van`
   */
  public uriWithoutFragment: string

  /**
   * `2-3` or `-4`
   */
  public fragment?: string

  /**
   * @param uri - `uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7#2-3` or `id:Beethoven_Ludwig-van#-4`
   */
  constructor (uri: string) {
    this.uri = uri
    const matches = MediaUri.regExp.exec(uri)
    if (matches == null || matches.groups == null) { throw new Error(`The media URI is not valid: ${uri}`) }
    const groups = matches.groups
    this.scheme = groups.scheme
    this.authority = groups.authority
    if (groups.fragment != null) {
      this.uriWithoutFragment = `${this.scheme}:${this.authority}`
      this.fragment = groups.fragment
    } else {
      this.uriWithoutFragment = uri
    }
  }
}

/**
 * Sleep some time
 *
 * @see {@link https://github.com/erikdubbelboer/node-sleep}
 *
 * @param milliSeconds
 */
export function msleep (milliSeconds: number): void {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliSeconds)
}

interface SelectionSubsetOption {
  /**
   * `numeric`, or a truety value.
   */
  sort?: string | boolean

  /**
   * An array of elements to build a subset
   */
  elements?: any[]

  /**
   * If `elements` is undefined, an array with integers is created und
   * used as `elements`.
   */
  elementsCount?: number

  /**
   *
   */
  firstElementNo?: number

  /**
   * Shift all selector numbers by this number: For example `-1`: `2-5`
   *   is internally treated as `1-4`
   */
  shiftSelector?: number
}

/**
 * Select a subset of elements by a string (`subsetSelector`). `1` is the first
 * element of the `elements` array.
 *
 * @param subsetSelector - Select a subset of elements. Examples
 *
 * - `` (emtpy string or value which evalutes to false): All elements.
 * - `1`: The first element.
 * - `1,3,5`: The first, the third and the fifth element.
 * - `1-3,5-7`: `1,2,3,5,6,7`
 * - `-7`: All elements from the beginning up to `7` (`1-7`).
 * - `7-`: All elements starting from `7` (`7-end`).
 *
 * @param options
 */
export function selectSubset (subsetSelector: string, { sort, elements, elementsCount, firstElementNo, shiftSelector }: SelectionSubsetOption): any[] {
  const subset = []
  if (shiftSelector == null) shiftSelector = 0

  // Create elements
  if (elements == null && elementsCount != null) {
    elements = []
    let firstNo
    if (firstElementNo != null) {
      firstNo = firstElementNo
    } else {
      firstNo = 0
    }
    const endNo = firstNo + elementsCount
    for (let i = firstNo; i < endNo; i++) {
      elements.push(i)
    }
  }

  if (elements == null) elements = []
  if (subsetSelector == null || subsetSelector === '') return elements

  // 1, 3, 5 -> 1,3,5
  subsetSelector = subsetSelector.replace(/\s*/g, '')
  // 1-3,5-7
  const ranges = subsetSelector.split(',')

  // for cloze steps: shiftSelector = -1
  // shiftSelectorAdjust = 1
  const shiftSelectorAdjust = -1 * shiftSelector
  for (let range of ranges) {
    // -7 -> 1-7
    if (range.match(/^-/) != null) {
      const end = parseInt(range.replace('-', ''))
      range = `${1 + shiftSelectorAdjust}-${end}`
    }

    // 7- -> 7-23
    if (range.match(/-$/) != null) {
      const begin = parseInt(range.replace('-', ''))
      // for cloze steps (shiftSelector: -1): 7- -> 7-23 -> elements.length
      // as 22 elements because 7-23 translates to 6-22.
      range = `${begin}-${elements.length + shiftSelectorAdjust}`
    }

    const rangeSplit: string[] = range.split('-')
    let startEnd: number[]

    if (rangeSplit.length === 2) {
      startEnd = [parseInt(rangeSplit[0]), parseInt(rangeSplit[1])]
    } else {
      startEnd = [parseInt(rangeSplit[0])]
    }

    // 1
    if (startEnd.length === 1) {
      const i = startEnd[0]
      subset.push(elements[i - 1 + shiftSelector])
    // 1-3
    } else if (startEnd.length === 2) {
      const beginNo = startEnd[0] + shiftSelector
      const endNo = startEnd[1] + shiftSelector
      if (endNo <= beginNo) {
        throw new Error(`Invalid range: ${beginNo}-${endNo}`)
      }
      for (let no = beginNo; no <= endNo; no++) {
        const index = no - 1
        subset.push(elements[index])
      }
    }
  }

  if (sort === 'numeric') {
    subset.sort((a, b) => a - b) // For ascending sort
  } else if (typeof sort === 'boolean' && sort) {
    subset.sort(undefined)
  }

  return subset
}

/**
 * Sort alphabetically an array of objects by some specific properties.
 *
 * @param property - Key of the object to sort.
 * @see {@link https://ourcodeworld.com/articles/read/764/how-to-sort-alphabetically-an-array-of-objects-by-key-in-javascript Tutorial}
 */
export function sortObjectsByProperty (property: string) {
  return function (a: {[key: string]: any}, b: {[key: string]: any}) {
    return a[property].localeCompare(b[property])
  }
}

/**
 * Check if the input is a valid URI. Prefix with `id:` if necessary.
 *
 * @param uri - The URI to validate.
 */
export function validateUri (uri: string): string {
  const segments = uri.split(':')
  // To allow URI with out a URI scheme. This defaults to `id`.
  if (segments.length === 1) {
    uri = `id:${uri}`
  }
  return uri
}

/**
 * Split a HTML text into smaller chunks by looping over the children.
 *
 * @param htmlString - A HTML string.
 * @param charactersOnSlide - The maximum number of characters that may be
 *   contained in a junk.
 *
 * @returns An array of HTML chunks.
 */
export function splitHtmlIntoChunks (htmlString: string, charactersOnSlide: number): string[] {
  /**
   * Add text to the chunks array. Add only text with real letters not with
   * whitespaces.
   *
   * @param htmlChunks - The array to be filled with HTML chunks.
   * @param htmlString - A HTML string to be added to the array.
   */
  function addHtml (htmlChunks: string[], htmlString: string): void {
    if (htmlString != null && htmlString.match(/^\s*$/) == null) {
      htmlChunks.push(htmlString)
    }
  }

  if (htmlString.length < charactersOnSlide) return [htmlString]

  const domParser = new DOMParser()
  let dom = domParser.parseFromString(htmlString, 'text/html')

  // If htmlString is a text without tags
  if (dom.body.children.length === 0) {
    dom = domParser.parseFromString(`<p>${htmlString}</p>`, 'text/html')
  }

  let text = ''
  const htmlChunks: string[] = []

  // childNodes not children!
  for (const children of dom.body.childNodes) {
    const element = children as HTMLElement
    // If htmlString is a text with inner tags
    if (children.nodeName === '#text') {
      if (element.textContent != null) text += `${element.textContent}`
    } else {
      if (element.outerHTML != null) text += `${element.outerHTML}`
    }
    if (text.length > charactersOnSlide) {
      addHtml(htmlChunks, text)
      text = ''
    }
  }
  // Add last not full text
  addHtml(htmlChunks, text)
  return htmlChunks
}
