<template>
  <div class="grades-list">
    <vue-headful title="Sitzpläne Musiksaal E 17"/>
    <h1>Sitzpläne Musiksaal E 17</h1>
    <ul>
      <li v-for="grade in grades" :key="grade">
        <router-link :to="'/grade/' + grade">
          {{ grade }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import dataStore from '../data-store.js'
import vueHeadful from 'vue-headful'

export default {
  name: 'GradesList',
  components: {
    vueHeadful
  },
  computed: {
    grades () {
      return dataStore.getGrades()
    }
  }
}
</script>

<style scoped>

</style>
