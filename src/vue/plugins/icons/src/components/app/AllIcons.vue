<template>
  <div class="vc_all_icons">
    <h1>All Icons</h1>

    <section class="all-icons">
      <p v-for="icon in iconNames" :key="icon">
        <material-icon :name="icon" />
        <span class="description">{{ icon }}</span>
      </p>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import MaterialIcon from '@/components/plugin/MaterialIcon.vue'

import iconNames from '../../icons.json'

@Component({ components: { MaterialIcon } })
export default class AllIcons extends Vue {
  get iconNames (): string[] {
    return iconNames
  }
}
</script>

<style lang="scss">
.vc_all_icons {
  .all-icons {
    columns: 4;

    .baldr-icon {
      font-size: 3em;
      margin-right: 0.5em;
    }
  }
}
</style>
