<template>
  <div>
    All Icons

    <p v-for="icon in icons" :key="icon" :name="icon">
      <material-icon :name="icon" />
      <span class="description">{{ icon }}</span>
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import MaterialIcon from '@/MaterialIcon.vue'

import icons from '../icons.json'

@Component({ components: { MaterialIcon } })
export default class AllIcons extends Vue {
  get icons (): string[] {
    return icons
  }
}
</script>
