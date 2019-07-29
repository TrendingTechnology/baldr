<template>
  <header>
    Stand: {{ stateDateCurrent }}
  </header>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'PlanHeader',
  computed: mapGetters(['stateDateCurrent'])
}
</script>

<style scoped>
  header {
    width: 100%;
  }
</style>
