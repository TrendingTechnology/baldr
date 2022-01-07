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

/**
 * This class represents an Uniform Resource Identifier (URI) for media and
 * presentation files. An optional fragment (`#1-7`) (subset or sample selector)
 * maybe included.
 *
 * Possible URIs are for example:
 * `ref:Rhythm-n-Blues-Rock-n-Roll_BD_Bill-Haley#complete`
 * `uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7`
 */
export class MediaUri {
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

  /**
   * For example: `ref:Beethoven_Ludwig-van#-4` or
   * `uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7#1,2,5-7`
   */
  public raw: string

  /**
   * For example: `ref` or `uuid`.
   */
  public scheme: 'ref' | 'uuid'

  /**
   * For example: `Beethoven_Ludwig-van` or
   * `c262fe9b-c705-43fd-a5d4-4bb38178d9e7`
   */
  public authority: string

  /**
   * For example: `ref:Beethoven_Ludwig-van` or
   * `uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7`
   */
  public uriWithoutFragment: string

  /**
   * For example: `-4` or `uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7#1,2,5-7`
   */
  public fragment?: string

  /**
   * @param uri - A Uniform Resource Identifier (URI). For example:
   *   `ref:Beethoven_Ludwig-van#-4` or
   *   `uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7#1,2,5-7`
   */
  constructor (uri: string) {
    this.raw = uri
    const matches = MediaUri.regExp.exec(uri)
    if (matches == null || matches.groups == null) {
      throw new Error(`The media URI is not valid: ${uri}`)
    }
    const groups = matches.groups

    if (groups.scheme !== 'ref' && groups.scheme !== 'uuid') {
      throw new Error('Media URI scheme has to be ref or uuid')
    }
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
   * @param uri - A media URI.
   *
   * @returns True if the given URI is a valid media URI.
   */
  public static check (uri: string): boolean {
    const matches = MediaUri.regExp.exec(uri)
    if (matches != null) {
      return true
    }
    return false
  }

  /**
   * Check if the input is a valid URI.
   *
   * @param uri -  The URI to validate.
   *
   * @returns The unchanged URI.
   *
   * @throws If the given URI is not valid.
   */
  public static validate (uri: string): string {
    if (!MediaUri.check(uri)) {
      throw new Error(`The URI “${uri}” is not valid!`)
    }
    return uri
  }

  public static compose (
    scheme: 'ref' | 'uuid',
    authority: string,
    fragment: string = ''
  ): string {
    if (fragment !== '') {
      fragment = '#' + fragment
    }
    return `${scheme}:${authority}${fragment}`
  }

  public static splitByFragment (uri: string): UriSplittedByFragment {
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
   * @param uri - A media URI (Uniform Resource Identifier) with an optional
   *   fragment suffix, for example `ref:Yesterday#complete`.
   *
   * @returns A media URI (Uniform Resource Identifier) without an optional
   *   fragment suffix, for example `ref:Yesterday`.
   */
  public static removeFragment (uri: string): string {
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
  public static removeScheme (uri: string): string {
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
