<template>
  <div class="grades-list">
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

export default {
  name: 'GradesList',
  computed: {
    grades () {
      return dataStore.getGrades()
    }
  }
}
</script>

<style scoped>

</style>
