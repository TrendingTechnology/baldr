// Project packages.
import { operations } from '@bldr/media-manager'

function action (filePath: string): void {
  operations.normalizePresentationFile(filePath)
}

export = action
