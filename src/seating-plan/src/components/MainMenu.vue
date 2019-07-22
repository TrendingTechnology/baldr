<template>
  <ul class="main-menu">
    <li><grades-items inline/></li>
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

    <!-- cloud upload -->
    <li>
      <a href="#" @click.prevent="exportToRestAPI" title="">
        <material-icon name="cloud-upload"/>
      </a>
    </li>

    <!-- cloud download -->
    <li>
      <router-link to='/import-from-cloud' title="Aus der Cloud importieren">
        <material-icon name="cloud-download"/>
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
import { mapActions } from 'vuex'

// Components
import ExportLink from './ExportLink.vue'
import GradesItems from './GradesItems.vue'
import MaterialIcon from './MaterialIcon.vue'
import SaveLink from './SaveLink.vue'

export default {
  name: 'MainMenu',
  components: {
    ExportLink,
    GradesItems,
    MaterialIcon,
    SaveLink
  },
  methods: {
    ...mapActions(['createTestData']),
    exportToRestAPI () {
      this.$store.dispatch('exportToRestAPI').then((result) => {
        const date = new Date(result.data.timeStampMsec)
        this.$notify({
          type: 'success',
          text: date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
        })
      })
    }
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

  @media print {
    .main-menu {
      display: none
    }
  }
</style>
