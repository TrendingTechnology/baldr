import { operations, walk } from '@bldr/media-manager'

/**
 * Generate from TeX files with cloze texts SVGs for baldr.
 */
async function action (filePath: string): Promise<void> {
  await walk(
    operations.generateCloze,
    { regex: new RegExp('.*.tex$'), path: filePath } // eslint-disable-line
  )
}

module.exports = action
