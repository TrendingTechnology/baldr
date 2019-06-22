<template>
  <div id="app">
    <LoremIpsum/>
  </div>
</template>

<script>
import LoremIpsum from './components/LoremIpsum.vue'

import '@bldr/theme-default-css'

export default {
  name: 'app',
  components: {
    LoremIpsum
  }
}
</script>
