/**
 * The REST API and command line interface of the BALDR project.
 *
 * # Media types:
 *
 * - presentation (`Presentation()`)
 * - asset (`Asset()`)
 *   - multipart asset (`filename.jpg`, `filename_no002.jpg`, `filename_no003.jpg`)
 *
 * # Definition of the objects:
 *
 * A _presentation_ is a YAML file for the BALDR presentation app. It must have
 * the file name scheme `*.baldr.yml`. The media server stores the whole YAML
 * file in the MongoDB database.
 *
 * A _asset_ is a media file which has a meta data file in the YAML format.
 * The file name scheme for this meta data file is `media-file.jpg.yml`. The
 * suffix `.yml` has to be appended. Only the content of the meta data file
 * is stored into the database.
 *
 * @module @bldr/rest-api
 */
import express from 'express'

import { startRestApi } from './api'

export { startRestApi as start } from './api'
export { default as openArchivesInFileManager } from './operations/open-archives-in-file-manager'
export { default as restart } from './operations/restart-systemd-service'

async function main (): Promise<express.Express> {
  let port
  if (process.argv.length === 3) {
    port = parseInt(process.argv[2])
  }
  return await startRestApi(port)
}

if (require.main === module) {
  main()
    .then()
    .catch(reason => console.log(reason))
}
