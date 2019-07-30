<template>
  <main class="start-page">
    <h2>Sitzpläne</h2>
    <grades-overview/>
  </main>
</template>

<script>
// Components
import GradesOverview from './GradesOverview'

export default {
  name: 'StartPage',
  components: {
    GradesOverview
  }
}
</script>
