<template>
  <div class="
    vc_sample_list_master_preview
    slide-preview-fullscreen
    slide-preview-fix-typography
  ">
    <h2 v-if="heading" v-html="heading"/>
    <ol>
      <li
        v-for="wrappedSample in samples.samples"
        :key="wrappedSample.uri"
        v-html="wrappedSample.titleSafe"
      />
    </ol>
  </div>
</template>

<script>
export default {
  props: {
    heading: {
      type: String
    },
    samples: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss">
  .vc_sample_list_master_preview {
  }
</style>
