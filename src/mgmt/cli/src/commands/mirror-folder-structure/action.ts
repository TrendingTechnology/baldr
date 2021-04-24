// Project packages.
import { mirrorFolderStructure } from '@bldr/media-server'

function action (): void {
  console.log(mirrorFolderStructure(process.cwd()))
}

export = action
