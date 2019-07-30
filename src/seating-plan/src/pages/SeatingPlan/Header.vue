<template>
  <header>
    <h1>
      {{ title }}
    </h1>
    <div class="meta">
      <aside class="left">Pirckheimer-Gymnasium, Nürnberg</aside>
      <aside class="right"><strong>Stand:</strong> {{ stateDateCurrent }}</aside>
    </div>
  </header>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'PlanHeader',
  computed: {
    ...mapGetters([
      'stateDateCurrent'
    ]),
    title () {
      return `Sitzplan der Klasse „${this.$store.getters.gradeNameCurrent}“`
    }
  }
}
</script>

<style scoped>
  header {
    width: 100%;
  }

  h1 {
    text-align: center;
  }

  .meta {
    display: flex;
  }

  .meta .left {
    flex-grow: 1;
  }

  .meta .right {
    text-align: right;
  }
</style>
