<template>
  <div class="seating-plan-view">
    <modal-dialog
      v-show="stateShowModal"
      @close="closeModal"
    >
      <person-select/>
    </modal-dialog>
    <main>
      <heading-title :title="title"/>
      <seating-plan/>
      <seating-plan-footer/>
    </main>
    <people-list/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import HeadingTitle from './HeadingTitle.vue'
import ModalDialog from './ModalDialog.vue'
import PersonSelect from './PersonSelect.vue'
import SeatingPlan from './SeatingPlan.vue'
import SeatingPlanFooter from './SeatingPlanFooter.vue'
import PeopleList from './PeopleList.vue'
import dataStore from '../data-store.js'

export default {
  name: 'SeatingPlanView',
  components: {
    SeatingPlan,
    PeopleList,
    HeadingTitle,
    PersonSelect,
    ModalDialog,
    SeatingPlanFooter
  },
  computed: {
    ...mapGetters(['getCurrentGrade']),
    title () {
      return 'Sitzplan der Klasse “' + this.getCurrentGrade + '”'
    },
    stateShowModal () {
      return dataStore.data.showModalPersonSelect
    }
  },
  methods: {
    showModal () {
      dataStore.data.showModalPersonSelect = true
    },
    closeModal () {
      dataStore.data.showModalPersonSelect = false
    }
  },
  beforeCreate: function () {
    let grade = this.$route.params.grade
    if (!dataStore.isGradeSet(grade)) {
      this.$router.push('/')
    }
  },
  created: function () {
    let gradeName = this.$route.params.grade
    dataStore.setCurrentGrade(gradeName) // TODO: remove
    this.$store.commit('setCurrentGrade', gradeName)
  }
}
</script>

<style scoped>
  .seating-plan-view {
    display: flex;
    align-items: stretch;
    position: relative;
  }

  main {
    width: 100%;
  }

  .people-list {
    flex-basis: content;
  }
</style>
