<template>
  <div>
    <h1>As a link</h1>
    <material-icon
      href="https://de.wikipedia.org/wiki/Cloud_Computing"
      name="cloud"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from '@bldr/vue-packages-bundler'

import MaterialIcon from '@/components/plugin/MaterialIcon.vue'

@Component({ components: { MaterialIcon } })
export default class Link extends Vue {}
</script>
