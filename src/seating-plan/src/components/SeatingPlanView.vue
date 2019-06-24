<template>
  <div class="seating-plan-view">
    <modal-dialog
      v-show="stateShowModal"
      @close="closeModal"
    >
      <person-select/>
    </modal-dialog>
    <heading-title :title="title"/>
    <section>
      <seating-plan/>
      <people-list/>
    </section>
  </div>
</template>

<script>
import HeadingTitle from './HeadingTitle.vue'
import ModalDialog from './ModalDialog.vue'
import PersonSelect from './PersonSelect.vue'
import SeatingPlan from './SeatingPlan.vue'
import PeopleList from './PeopleList.vue'
import dataStore from '../data-store.js'

export default {
  name: 'SeatingPlanView',
  components: {
    SeatingPlan,
    PeopleList,
    HeadingTitle,
    PersonSelect,
    ModalDialog
  },
  computed: {
    currentGrade () {
      return dataStore.getCurrentGrade()
    },
    title () {
      return 'Sitzplan der Klasse “' + this.currentGrade + '”'
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
  created: function () {
    let grade = this.$route.params.grade
    dataStore.setCurrentGrade(grade)
  }
}
</script>

<style scoped>
.seating-plan-view section {
  display: flex;
  align-items: stretch;
  position: relative;
}

.people-list {
  flex-basis: content;
}
</style>
