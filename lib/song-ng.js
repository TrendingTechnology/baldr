
class Song {
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

  }

  /**
   * composer, artist, genre
   */
  get composer() {

  }

  /**
   * lyricist
   */
  get lyricist() {

  }
}
