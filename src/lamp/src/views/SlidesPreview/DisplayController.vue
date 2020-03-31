<template>
  <div class="vc_display_controller">
    <span class="link" @click="switchPreviewLayout">
      {{ previewLayoutCurrent.title }}
    </span>

    <span @click="switchPreviewDetail">
      <span class="link" v-if="previewDetail">kompakt </span>
      <span class="link" v-if="!previewDetail">ausführlich </span>
    </span>

    <span @click="switchPreviewHierarchical">
      <span class="link" v-if="!previewHierarchical">flach </span>
      <span class="link" v-if="previewHierarchical">hierarchisch </span>
    </span>

    <span class="link" @click="decreasePreviewSize">- </span>

    <span class="link" @click="increasePreviewSize">+ </span>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters } = createNamespacedHelpers('presentation')

export default {
  name: 'DisplayController',
  computed: mapGetters([
    'previewLayoutCurrent',
    'previewDetail',
    'previewHierarchical'
  ]),
  methods: mapActions([
    'increasePreviewSize',
    'decreasePreviewSize',
    'switchPreviewDetail',
    'switchPreviewLayout',
    'switchPreviewHierarchical'
  ])
}
</script>

<style lang="scss">
  .vc_display_controller {
    display: flex;
    justify-content: flex-end;
    font-size: 0.9vw;

    & > span {
      margin: 0 0.2em;
    }
  }
</style>
