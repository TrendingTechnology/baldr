<template>
  <ul class="main-menu">
    <!-- save -->
    <li>
      <save-link/>
    </li>

    <!-- jobs -->
    <li>
      <router-link to='/jobs-manager' title="Dienste verwalten">
        <material-icon name="worker"/>
      </router-link>
    </li>

    <!-- spreadsheet import -->
    <li>
      <router-link to='/import-persons' title="importieren (Str+c aus LibreOffice)">
        <material-icon name="google-spreadsheet"/>
      </router-link>
    </li>

    <!-- json import -->
    <li>
      <router-link to='/import-data' title="Daten importieren (als JSON)">
        <material-icon name="import"/>
      </router-link>
    </li>

    <!-- json export -->
    <li>
      <export-link/>
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
import { mapActions } from 'vuex'

// Components
import MaterialIcon from './MaterialIcon.vue'
import SaveLink from './SaveLink.vue'
import ExportLink from './ExportLink.vue'

export default {
  name: 'MainMenu',
  components: { MaterialIcon, SaveLink, ExportLink },
  methods: {
    ...mapActions(['createTestData'])
  }
}
</script>

<style scoped>
  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  li {
    float: left;
  }
</style>
