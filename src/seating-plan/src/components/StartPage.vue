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
      <li><a href="#" @click.prevent="createTestData">Test-Daten erzeugen</a></li>
      <li><router-link to='/jobs-manager'>Dienste verwalten</router-link></li>
    </ul>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

// Components
import HeadingTitle from './HeadingTitle.vue'

export default {
  name: 'StartPage',
  components: {
    HeadingTitle
  },
  computed: mapGetters(['gradeNames']),
  methods: mapActions(['createTestData'])
}
</script>

<style scoped>

</style>
