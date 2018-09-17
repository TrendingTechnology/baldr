
/**
 * Extract values of given properties of an object and collect it in
 * an array.
 */
function collectProperties(properties, object) {
  let parts = [];
  for (let property of properties) {
    if (property in object) {
      parts.push(object[property]);
    }
  }
  return parts;
}


class SongMetaData {

  constructor(info) {
    this.rawInfo = info;
  }

  /**
   * title (year)
   */
  get title() {
    let out;
    if ('title' in this.rawInfo) {
      out = this.rawInfo.title;
    }
    else {
      out = '';
    }

    if ('year' in this.rawInfo) {
      return `${out} (${this.rawInfo.year})`;
    }
    else {
      return out;
    }

  }

  /**
   * subtitle - alias - country
   */
  get subtitle() {
    return collectProperties(
      ['subtitle', 'alias', 'country'],
      this.rawInfo
    ).join(' - ');
  }

  /**
   * composer, artist, genre
   */
  get composer() {
    return collectProperties(
      ['composer', 'artist', 'genre'],
      this.rawInfo
    ).join(', ');
  }

  /**
   * lyricist
   */
  get lyricist() {
    if ('lyricist' in this.rawInfo) {
      return this.rawInfo.lyricist;
    }
    else {
      return '';
    }
  }
}
