<template>
  <main class="vc_start_page">
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
import GradesOverview from './GradesOverview.vue'
import MetaTable from './MetaTable.vue'

export default {
  name: 'StartPage',
  components: {
    GradesOverview,
    MetaTable
  }
}
</script>

<style lang="scss">
  .vc_start_page {
    display: flex;
    justify-content: space-around;
  }
</style>
