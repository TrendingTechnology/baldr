<template>
  <main class="start-page">
    <section>
      <h2>Sitzpläne</h2>
      <grades-overview/>
    </section>

    <section>
      <h2>Angaben</h2>
      <meta-table/>
    </section>
  </main>
</template>

<script>
// Components
import GradesOverview from './GradesOverview'
import MetaTable from './MetaTable'

export default {
  name: 'StartPage',
  components: {
    GradesOverview,
    MetaTable
  }
}
</script>

<style scoped>
  main {
    display: flex;
    justify-content: space-around;
  }
</style>
