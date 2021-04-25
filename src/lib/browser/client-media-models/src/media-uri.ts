
/**
 * Uniform Resource Identifier for media files, for example `id:Haydn`, or
 * `http://example.com/Haydn_Joseph.jpg`. An optional fragment (`#1-7`) (subset
 * selector) maybe included.
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
   * The full, raw and unmodifed URI (Uniform Resource Identifier) as specified, for example
   * `uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7#2-3` or `id:Beethoven_Ludwig-van#-4`.
   */
  public raw: string

  /**
   * for example: `id`, `uuid`, `http`, `https`, `blob`
   */
  public scheme: string

  /**
   * for example: `//example.com/Haydn_Joseph.jpg`,
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
}

/**
 * Make Media URI objects for a single URI or an array of URIs.
 *
 * @param uris - A single media URI or an array of media URIs.
 *
 * @returns An array of media URIs objects.
 */
export function makeMediaUris (uris: string | string[]): MediaUri[] {
  if (typeof uris === 'string') {
    uris = [uris]
  }
  const mediaUris: MediaUri[] = []
  for (const uri of uris) {
    mediaUris.push(new MediaUri(uri))
  }
  return mediaUris
}
