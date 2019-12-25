<template>
  <div class="vc_blank_master"/>
</template>

<script>
import vue from '@/main.js'

export default {
  mounted () {
    vue.$store.commit('presentation/setShowBlank', false)
  }
}
</script>
