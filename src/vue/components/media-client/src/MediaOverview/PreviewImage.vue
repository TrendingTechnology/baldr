
<script>
export default {
  name: 'PreviewImage',
  props: ['asset'],
  render: function (createElement) {
    if (this.asset.mimeType === 'image') {
      return createElement('img', { attrs: { src: this.asset.httpUrl } })
    } else if (this.asset.mimeType === 'document' && this.asset.previewHttpUrl != null) {
      return createElement('img', { attrs: { src: this.asset.previewHttpUrl } })
    } else if (this.asset.isPlayable && this.asset.previewHttpUrl != null) {
      return createElement('img', { attrs: { src: this.asset.previewHttpUrl, title: 'abspielen' } })
    } else if (this.asset.mimeType === 'video') {
      return createElement('video', { attrs: { src: this.asset.httpUrl, title: 'abspielen' } })
    } else {
      return createElement('material-icon', { props: { name: `file-${this.asset.mimeType}` } })
    }
  }
}
</script>

<style lang="scss" scoped>
  img, video {
    width: 4vw;
    height: 4vw;
    object-fit: cover;
    background-color: scale-color($gray, $lightness: 10%);
    padding: 0.3vw;
  }
</style>
