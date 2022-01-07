import fs from 'fs'
import * as musicMetadata from 'music-metadata'

export interface AudioMetadataContainer {
  title: string
  artist?: string
  composer?: string
  album?: string
  musicbrainz_recording_id?: string
  musicbrainz_work_id?: string
  duration?: number
}

/**
 * Output from `music-metadata`:
 *
 * ```js
 * {
 *   format: {
 *     tagTypes: [ 'ID3v2.3', 'ID3v1' ],
 *     lossless: false,
 *     container: 'MPEG',
 *     codec: 'MP3',
 *     sampleRate: 44100,
 *     numberOfChannels: 2,
 *     bitrate: 192000,
 *     codecProfile: 'CBR',
 *     numberOfSamples: 18365184,
 *     duration: 416.4440816326531
 *   },
 *   native: undefined,
 *   quality: { warnings: [] },
 *   common: {
 *     track: { no: 2, of: 7 },
 *     disk: { no: 1, of: 1 },
 *     title: 'Symphonie fantastique, Op. 14: II. Un bal',
 *     artists: [ 'Hector Berlioz' ],
 *     artist: 'Hector Berlioz',
 *     album: 'Symphonie fantastique / Lélio',
 *     media: 'CD',
 *     originalyear: 1998,
 *     year: 1998,
 *     label: [ 'BMG Classics' ],
 *     artistsort: 'Berlioz, Hector',
 *     asin: 'B000006OPB',
 *     barcode: '090266893027',
 *     musicbrainz_recordingid: 'ca3b02af-b6be-4f95-8217-31126b2c2b67',
 *     catalognumber: [ '09026-68930-2' ],
 *     releasetype: [ 'album' ],
 *     releasecountry: 'US',
 *     acoustid_id: 'ed58118e-3b76-492b-9453-223d0ca72b86',
 *     musicbrainz_albumid: '986209e3-ce80-4b66-af78-22a035dde993',
 *     musicbrainz_artistid: [ '274774a7-1cde-486a-bc3d-375ec54d552d' ],
 *     albumartist: 'Berlioz; San Francisco Symphony & Chorus, Michael Tilson Thomas',
 *     musicbrainz_releasegroupid: '3a7e05b9-14fd-3cff-ac29-e568dd10a2a9',
 *     musicbrainz_trackid: 'c90eaa1c-2be5-4eba-a37e-fa3d1dfb0882',
 *     albumartistsort: 'Berlioz, Hector; San Francisco Symphony & San Francisco Symphony Chorus, Tilson Thomas, Michael',
 *     musicbrainz_albumartistid: [
 *       '274774a7-1cde-486a-bc3d-375ec54d552d',
 *       'deebc49a-6e06-418e-860f-8c7f770a8bac',
 *       '568d7c51-0573-4c65-9211-65bf8c8470c7',
 *       'f6df125a-a83c-4161-8cbe-48f4a3a7cad5'
 *     ],
 *     picture: [ [Object] ]
 *   }
 * }
 * ```
 */
export async function collectAudioMetadata (
  inputFile: string
): Promise<AudioMetadataContainer | undefined> {
  const metaData = await musicMetadata.parseFile(inputFile)
  const output: AudioMetadataContainer = { title: '' }

  if (metaData.format.duration != null) {
    output.duration = metaData.format.duration
  }

  if (metaData.common != null) {
    const common = metaData.common
    if (common.title != null) {
      output.title = common.title
    }
    if (common.albumartist != null) {
      output.artist = common.albumartist
    }
    if (common.artist != null) {
      output.composer = common.artist
    }
    if (common.album != null) {
      output.album = common.album
    }
    if (common.musicbrainz_recordingid != null) {
      output.musicbrainz_recording_id = common.musicbrainz_recordingid
    }
    if (common.musicbrainz_workid != null) {
      output.musicbrainz_work_id = common.musicbrainz_workid
    }
    if (output.album != null && output.title != null) {
      output.title = `${output.album}: ${output.title}`
      delete output.album
    }
    return output
  }
}

export async function extractCoverImage (
  inputFile: string,
  destPath: string
): Promise<void> {
  const metaData = await musicMetadata.parseFile(inputFile)
  if (metaData.common.picture != null) {
    fs.writeFileSync(destPath, metaData.common.picture[0].data)
  }
}
