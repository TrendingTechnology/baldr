<template>
  <div class="vc_media_file" b-ui-theme="default">
    <table class="key-value-table">
      <thead>
        <tr>
          <th>key</th>
          <th>value</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(value, key) in mediaFile" :key="key">
          <th class="key">{{ key }}</th>
          <td>{{ value }}</td>
        </tr>
      </tbody>

    </table>
    <div ref="mediaElementContainer" class="media-file-element"/>
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
    width: 100vw;
    height: 100vh;
    display: flex;
    padding: 4vw;

    .key {
      font-weight: bold;
      text-align: right;
      padding-right: 1em;
    }
  }
</style>

<style lang="scss">
  .vc_media_file {
    .media-file-element {
      img {
        width: 30vw;
      }
    }
  }
</style>