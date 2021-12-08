<template>
  <aside class="vc_persons_sidebar">
    <router-link
      :to="{
        name: 'administer-persons',
        params: { grade: gradeNameCurrent }
      }"
    >
      Klassenliste verwalten
    </router-link>
    <persons-list />
  </aside>
</template>

<script lang="ts">
import { Component, Vue, mapGetters } from '@bldr/vue-packages-bundler'

import PersonsList from './PersonsList.vue'

@Component({
  components: {
    PersonsList
  },
  computed: mapGetters([
    'gradeNameCurrent',
    'personsByGradeAsListSortedCurrent'
  ])
})
export default class PersonsSidebar extends Vue {}
</script>

<style lang="scss">
.vc_persons_sidebar {
  display: block;
  white-space: nowrap;

  @media print {
    display: none;
  }
}
</style>
