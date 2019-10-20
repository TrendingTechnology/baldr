<template>
  <div class="vc_media_file" b-ui-theme="default">
    <table>
      <tr v-for="(value, key) in mediaFile" :key="key">
        <td class="key">{{ key }}</td>
        <td>{{ value }}</td>
      </tr>
    </table>
    <div ref="mediaElementContainer">

    </div>
  </div>
</template>

<script>
export default {
  name: 'MediaFile',
  computed: {
    mediaFile () {
      const params = this.$route.params
      let uri = `${params.uriScheme}:${params.uriAuthority}`
      return this.$store.getters['media/mediaFileByUri'](uri)
    }
  },
  mounted () {
    if (this.mediaFile.isPlayable) {
      this.mediaFile.mediaElement.controls = true
    }
    this.$refs.mediaElementContainer.appendChild(this.mediaFile.mediaElement)
  }
}
</script>

<style lang="scss" scoped>
  .vc_media_file {
    font-size: 1vw;

    .key {
      font-weight: bold;
      text-align: right;
      padding-right: 1em;
    }
  }
</style>
