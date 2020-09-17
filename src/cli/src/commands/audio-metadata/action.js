// Project packages.
const { collectMusicMetaData } = require('../convert/action.js')

/**
 * @param {String} audioFile
 */
async function action (audioFile) {
  const result = await collectMusicMetaData(audioFile)
  console.log(result)
}

module.exports = action
