<template>
  <div class="vc_display_controller">
    <span class="link" @click="switchLayout">
      {{ layoutCurrent.title }}
    </span>

    <span @click="switchDetail">
      <span class="link" v-if="detail">kompakt </span>
      <span class="link" v-if="!detail">ausführlich </span>
    </span>

    <span @click="switchHierarchical">
      <span class="link" v-if="!hierarchical">flach </span>
      <span class="link" v-if="hierarchical">hierarchisch </span>
    </span>

    <span class="link" @click="decreaseSize">- </span>

    <span class="link" @click="increaseSize">+ </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { createNamespacedHelpers } from 'vuex'

const { mapActions, mapGetters } = createNamespacedHelpers('lamp/preview')

@Component({
  computed: mapGetters(['layoutCurrent', 'detail', 'hierarchical']),
  methods: mapActions([
    'increaseSize',
    'decreaseSize',
    'switchDetail',
    'switchLayout',
    'switchHierarchical'
  ])
})
export default class DisplayController extends Vue {}
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
