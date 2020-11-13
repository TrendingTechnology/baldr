// Project packages.
import { mirrorFolderStructure } from '@bldr/media-server'

function action () {
  console.log(mirrorFolderStructure(process.cwd()))
}

export = action
