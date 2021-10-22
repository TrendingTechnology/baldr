import { ClientMediaModelsTypes } from '@bldr/type-definitions'

/**
 * Example `ref:Alla-Turca#complete`
 */
interface UriSplittedByFragment {
  /**
   * Prefix before `#`, for example `ref:Alla-Turca`
   */
  prefix: string

  /**
   * The fragment, suffix after `#`, for example `complete`
   */
  fragment?: string
}

export class MediaUri implements ClientMediaModelsTypes.MediaUri {
  private static readonly schemes: string[] = ['ref', 'uuid']

  private static readonly regExpAuthority: string = 'a-zA-Z0-9-_'

  /**
   * `#Sample1` or `#1,2,3` or `#-4`
   */
  private static readonly regExpFragment: string =
  MediaUri.regExpAuthority + ','

  public static regExp: RegExp = new RegExp(
    '(?<uri>' +
      '(?<scheme>' +
      MediaUri.schemes.join('|') +
      ')' +
      ':' +
      '(' +
      '(?<authority>[' +
      MediaUri.regExpAuthority +
      ']+)' +
      '(' +
      '#' +
      '(?<fragment>[' +
      MediaUri.regExpFragment +
      ']+)' +
      ')?' +
      ')' +
      ')'
  )

  public raw: string
  public scheme: string
  public authority: string
  public uriWithoutFragment: string
  public fragment?: string

  /**
   * @param uri - `uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7#2-3` or
   * `ref:Beethoven_Ludwig-van#-4`
   */
  constructor (uri: string) {
    this.raw = uri
    const matches = MediaUri.regExp.exec(uri)
    if (matches == null || matches.groups == null) {
      throw new Error(`The media URI is not valid: ${uri}`)
    }
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

  /**
   * Check if the given media URI is a valid media URI.
   *
   * @param uri A media URI.
   *
   * @returns True if the given URI is a valid media URI.
   */
  static check (uri: string): boolean {
    const matches = MediaUri.regExp.exec(uri)
    if (matches != null) {
      return true
    }
    return false
  }

  static splitByFragment (uri: string): UriSplittedByFragment {
    if (uri.indexOf('#') > 0) {
      const segments = uri.split('#')
      if (segments.length !== 2) {
        throw new Error(`The media URI ${uri} couldn’t be splitted`)
      }
      return {
        prefix: segments[0],
        fragment: segments[1]
      }
    }
    return {
      prefix: uri
    }
  }

  /**
   * Remove the fragment suffix of an media URI.
   *
   * @param uri A media URI (Uniform Resource Identifier) with an optional
   *   fragment suffix, for example `ref:Yesterday#complete`.
   *
   * @returns A media URI (Uniform Resource Identifier) without an optional
   *   fragment suffix, for example `ref:Yesterday`.
   */
  static removeFragment (uri: string): string {
    const splitted = MediaUri.splitByFragment(uri)
    return splitted.prefix
  }

  /**
   * Remove the scheme prefix from a media URI, for example `ref:Fuer-Elise` is
   * converted to `Fuer-Elise`.
   *
   * @param uri A media URI.
   *
   * @returns The URI without the scheme, for example `Fuer-Elise`.
   */
  static removeScheme (uri: string): string {
    if (uri.indexOf('ref:') === 0) {
      return uri.replace('ref:', '')
    } else if (uri.indexOf('uuid:') === 0) {
      return uri.replace('uuid:', '')
    } else {
      return uri
    }
  }
}

/**
 * Make Media URI objects from a single URI or an array of URIs.
 *
 * @param uris - A single media URI or an array of media URIs.
 *
 * @returns An array of media URIs objects.
 */
export function makeMediaUris (
  uris: string | string[] | Set<string>
): MediaUri[] {
  let urisNormalized: Set<string>
  if (typeof uris === 'string') {
    urisNormalized = new Set([uris])
  } else if (Array.isArray(uris)) {
    urisNormalized = new Set(uris)
  } else {
    urisNormalized = uris
  }
  const mediaUris: MediaUri[] = []
  for (const uri of urisNormalized) {
    mediaUris.push(new MediaUri(uri))
  }
  return mediaUris
}

/**
 * Find recursively media URIs. Suffix fragments will be removed.
 *
 * @param data An object, an array or a string.
 * @param uris This set is filled with the results.
 */
export function findMediaUris (data: any, uris: Set<string>): void {
  // Array
  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      findMediaUris(data[i], uris)
    }
    // Object
  } else if (typeof data === 'object') {
    for (const prop in data) {
      findMediaUris(data[prop], uris)
    }
  } else if (typeof data === 'string') {
    if (MediaUri.check(data)) {
      uris.add(MediaUri.removeFragment(data))
    }
  }
}
