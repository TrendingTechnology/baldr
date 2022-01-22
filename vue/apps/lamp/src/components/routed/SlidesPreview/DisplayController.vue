<template>
  <div class="vc_display_controller gradually-appear">
    <clickable-icon
      v-if="layoutCurrent.id === 'list'"
      @click.native="switchDetail"
      name="slides-preview-detailed"
      :disabled="detail"
    />

    <span @click="switchLayout">
      <clickable-icon
        v-if="layoutCurrent.id === 'list'"
        name="slides-preview-grid"
      />
      <clickable-icon v-else name="slides-preview-list" />
    </span>

    <clickable-icon
      @click.native="switchHierarchical"
      name="slides-preview-hierarchical"
      :disabled="!hierarchical"
    />

    <clickable-icon
      name="slides-preview-enlarge"
      @click.native="decreaseSize"
    />

    <clickable-icon name="slides-preview-shrink" @click.native="increaseSize" />
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
export default class DisplayController extends Vue {
  layoutCurrent!: {
    id: 'grid' | 'list'
    title: 'Gitter' | 'Liste'
  }

  detail!: boolean

  hierarchical!: boolean

  increaseSize!: () => void

  decreaseSize!: () => void

  switchDetail!: () => void

  switchLayout!: () => void

  switchHierarchical!: () => void
}
</script>

<style lang="scss">
.vc_display_controller {
  position: absolute;
  right: 1vw;
  top: 1vw;
  font-size: 3vmin;
}
</style>
