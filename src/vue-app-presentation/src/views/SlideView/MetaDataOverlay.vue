<template>
  <div v-if="isVisible" class="vc_meta_data_overlay" b-ui-theme="default">
    <h1
      v-if="metaData.title"
      class="transparent-bg"
      v-html="metaData.title"
    />
    <p
      v-if="metaData.source"
      class="transparent-bg"
      v-html="metaData.source"
    />
    <p
      v-if="metaData.description"
      class="transparent-bg"
      v-html="metaData.description"
    />
  </div>
</template>

<script>
export default {
  name: 'MetaDataOverlay',
  computed: {
    metaData: function () {
      return this.$store.getters['presentation/slideCurrent'].metaData
    },
    isVisible: function () {
      return this.$store.getters['presentation/showMetaDataOverlay']
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_meta_data_overlay {
    position: absolute;
    top: 0;
    left: 0;
    padding: 1em;

    .transparent-bg {
      background: rgba(170, 170, 170, 0.3);
      padding: 0.1em;
    }
  }
</style>
