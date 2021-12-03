<template>
  <div>
    All Icons

    <p v-for="icon in iconNames" :key="icon" :name="icon">
      <material-icon :name="icon" />
      <span class="description">{{ icon }}</span>
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import MaterialIcon from '@/components/plugin/MaterialIcon.vue'

import iconNames from '@/icons.json'

@Component({ components: { MaterialIcon } })
export default class AllIcons extends Vue {
  get iconNames (): string[] {
    return iconNames
  }
}
</script>
