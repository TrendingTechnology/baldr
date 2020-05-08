module.exports = {
  command: 'youtube <youtube-id>',
  alias: 'yt',
  description: 'Download a YouTube-Video',
  checkExecutable: [
    'youtube-dl'
  ]
}
