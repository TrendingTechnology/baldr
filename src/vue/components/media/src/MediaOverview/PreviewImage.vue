
<script>
export default {
  name: 'PreviewImage',
  props: ['mediaFile'],
  render: function (createElement) {
    const file = this.mediaFile

    if (file.type === 'image') {
      return createElement('img', { attrs: { src: file.httpUrl } })
    } else if (['audio', 'video'].includes(file.type) && 'previewHttpUrl' in file) {
      return createElement('img', { attrs: { src: file.previewHttpUrl } })
    } else {
      return createElement('material-icon', { props: { name: `file-${file.type}`, class: { placeholderIcon: true } } })
    }
  }
}
</script>

<style lang="scss" scoped>
  img {
    width: 4vw;
    height: 4vw;
    object-fit: cover;
    background-color: scale-color($gray, $lightness: -70%);
    padding: 0.3vw;
  }

  .placeholder-icon {
    width: 4vw;
    height: 4vw;
    background-color: scale-color($gray, $lightness: -70%);
    padding: 0.3vw;
    font-size: 3vw;
    text-align: center;
  }
</style>