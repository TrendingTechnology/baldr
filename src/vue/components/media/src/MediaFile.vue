<template>
  <div class="media-file">
    <table>
      <tr v-for="(value, key) in mediaFile" :key="key">
        <td class="key">{{ key }}</td>
        <td>{{ value }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'MediaFile',
  computed: {
    mediaFile () {
      let uri = `id:${this.$route.params.id}`
      return this.$store.getters['media/mediaFileByUri'](uri)
    }
  }
}
</script>

<style lang="scss" scoped>
  .media-file {
    font-size: 1vw;
    .key {
      font-weight: bold;
      text-align: right;
      padding-right: 1em;
    }
  }
</style>
