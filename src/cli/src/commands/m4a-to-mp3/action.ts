import fs from 'fs'

async function action (): Promise<void> {
  const files = fs.readdirSync(process.cwd())

  for (const file of files) {
    console.log(file)
    if (file.match(/\.m4a$/) != null) {
      fs.unlinkSync(file)
    }

    if (file.match(/\.m4a\./) != null) {
      fs.renameSync(file, file.replace('.m4a.', '.mp3.'))
    }
  }
}

module.exports = action
