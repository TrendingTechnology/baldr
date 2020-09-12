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
    <persons-list/>
  </aside>
</template>

<script>
import { mapGetters } from 'vuex'

// Components
import PersonsList from './PersonsList.vue'

export default {
  name: 'PersonsSidebar',
  components: {
    PersonsList
  },
  data: function () {
    return {
      lastName: '',
      firstName: ''
    }
  },
  computed: mapGetters([
    'gradeNameCurrent',
    'personsByGradeAsListSortedCurrent'
  ])
}
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
