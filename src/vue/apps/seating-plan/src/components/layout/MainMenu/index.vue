<template>
  <ul class="main-menu">

    <li><grades-items inline/></li>

    <!-- save -->
    <li>
      <save-link/>
    </li>

    <!-- jobs -->
    <li>
      <router-link :to="{ name: 'jobs-manager' }" title="Dienste verwalten">
        <material-icon name="worker"/>
      </router-link>
    </li>

    <!-- spreadsheet import -->
    <li>
      <router-link :to="{ name: 'spreadsheet-import' }" title="importieren (Str+c aus LibreOffice)">
        <material-icon name="google-spreadsheet"/>
      </router-link>
    </li>

    <!-- json export -->
    <li>
      <export-link/>
    </li>

    <!-- json import -->
    <li>
      <router-link :to="{ name: 'json-import' }" title="Daten importieren (als JSON)">
        <material-icon name="import"/>
      </router-link>
    </li>

    <!-- cloud download -->
    <li>
      <router-link :to="{ name: 'time-travel' }" title="Zeitreise">
        <material-icon name="timeline-text"/>
      </router-link>
    </li>

    <!-- test -->
    <li>
      <a href="#" @click.prevent="createTestData" title="Test-Daten erzeugen">
        <material-icon name="test-tube"/>
      </a>
    </li>
  </ul>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

// Components
import ExportLink from './ExportLink'
import GradesItems from './GradesItems'
import SaveLink from './SaveLink'

export default {
  name: 'MainMenu',
  components: {
    ExportLink,
    GradesItems,
    SaveLink
  },
  computed: mapGetters([
    'stateDateCurrent'
  ]),
  methods: {
    ...mapActions([
      'createTestData'
    ])
  }
}
</script>

<style scoped>
  ul {
    font-size: 0.8em;
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  li {
    float: left;
    padding: 0.3em;
  }

  @media print {
    .main-menu {
      display: none
    }
  }
</style>
