
<script>
export default {
  name: 'PreviewImage',
  props: ['mediaFile'],
  render: function (createElement) {
    const file = this.mediaFile

    if (file.type === 'image') {
      return createElement('img', { attrs: { src: file.httpUrl } })
    } else if (file.isPlayable && 'previewHttpUrl' in file) {
      return createElement('img', { attrs: { src: file.previewHttpUrl, title: 'abspielen' } })
    } else if (file.type === 'video') {
      return createElement('video', { attrs: { src: file.httpUrl, title: 'abspielen' } })
    } else {
      return createElement('material-icon', { props: { name: `file-${file.type}` } })
    }
  }
}
</script>

<style lang="scss" scoped>
  img, video {
    width: 4vw;
    height: 4vw;
    object-fit: cover;
    background-color: scale-color($gray, $lightness: -70%);
    padding: 0.3vw;
  }
</style>
