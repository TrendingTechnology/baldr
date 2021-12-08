<template>
  <ul class="vc_main_menu">
    <li><grades-items inline /></li>

    <!-- save -->
    <li>
      <save-link />
    </li>

    <!-- jobs -->
    <li>
      <router-link :to="{ name: 'jobs-manager' }" title="Dienste verwalten">
        <material-icon name="worker" />
      </router-link>
    </li>

    <!-- spreadsheet import -->
    <li>
      <router-link
        :to="{ name: 'spreadsheet-import' }"
        title="importieren (Str+c aus LibreOffice)"
      >
        <material-icon name="google-spreadsheet" />
      </router-link>
    </li>

    <!-- json export -->
    <li>
      <export-link />
    </li>

    <!-- json import -->
    <li>
      <router-link
        :to="{ name: 'json-import' }"
        title="Daten importieren (als JSON)"
      >
        <material-icon name="import" />
      </router-link>
    </li>

    <!-- cloud download -->
    <li>
      <router-link :to="{ name: 'time-travel' }" title="Zeitreise">
        <material-icon name="timeline-text" />
      </router-link>
    </li>

    <li>
      <material-icon @click.native="$fullscreen" name="fullscreen" />
    </li>
  </ul>
</template>

<script lang="ts">
import {
  mapActions,
  mapGetters,
  Component,
  Vue
} from '@bldr/vue-packages-bundler'

import ExportLink from './ExportLink.vue'
import GradesItems from './GradesItems.vue'
import SaveLink from './SaveLink.vue'

@Component({
  components: {
    ExportLink,
    GradesItems,
    SaveLink
  },
  computed: mapGetters(['stateDateCurrent']),
  methods: {
    ...mapActions(['createTestData'])
  }
})
export default class MainMenu extends Vue {}
</script>

<style lang="scss">
.vc_main_menu {
  font-size: 0.8em;
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;

  li {
    float: left;
    padding: 0.3em;
  }

  @media print {
    .vc_main_menu {
      display: none;
    }
  }
}
</style>
