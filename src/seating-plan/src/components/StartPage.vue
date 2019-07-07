<template>
  <div class="grades-list">
    <heading-title title="Sitzpläne Musiksaal E 17"/>

    <h2>Sitzpläne</h2>
    <ul>
      <li v-for="gradeName in gradeNames" :key="gradeName">
        <router-link :to="'/grade/' + gradeName">
          {{ gradeName }}
        </router-link>
      </li>
    </ul>

    <h2>Administration</h2>

    <ul>
      <li><router-link to='/import-persons'>importieren (Str+c aus LibreOffice)</router-link></li>
      <li><router-link to='/export-data'>Daten exportieren (als JSON)</router-link></li>
      <li><router-link to='/import-data'>Daten importieren (von JSON)</router-link></li>
      <li><router-link to='/test-data'>Test-Daten erzeugen</router-link></li>
      <li><router-link to='/jobs-manager'>Dienste verwalten</router-link></li>
    </ul>

  </div>
</template>

<script>
import HeadingTitle from './HeadingTitle.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'StartPage',
  components: {
    HeadingTitle
  },
  computed: mapGetters(['gradeNames'])
}
</script>

<style scoped>

</style>
