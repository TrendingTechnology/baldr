<template>
  <div class="seating-plan-view">
    <modal-dialog
      v-show="showModal"
      @close="closeModal"
    >
      <person-select/>
    </modal-dialog>
    <main>
      <seating-plan/>
      <persons-list/>
    </main>
    <seating-plan-footer/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

// Components
import ModalDialog from './ModalDialog.vue'
import PersonSelect from './PersonSelect.vue'
import PersonsList from './PersonsList.vue'
import SeatingPlan from './SeatingPlan.vue'
import SeatingPlanFooter from './SeatingPlanFooter.vue'

export default {
  name: 'SeatingPlanView',
  components: {
    ModalDialog,
    PersonSelect,
    PersonsList,
    SeatingPlan,
    SeatingPlanFooter
  },
  computed: mapGetters(['gradeNameCurrent', 'showModal']),
  methods: {
    ...mapActions(['closeModal'])
  },
  beforeCreate: function () {
    let grade = this.$route.params.grade
    if (!this.$store.getters.grade(grade)) {
      this.$router.push('/')
    }
  },
  created: function () {
    let gradeName = this.$route.params.grade
    this.$store.commit('setGradeNameCurrent', gradeName)
  },
  beforeRouteUpdate (to, from, next) {
    this.$store.commit('setGradeNameCurrent', to.params.grade)
    next()
  }
}
</script>

<style scoped>
  main {
    display: flex;
    align-items: stretch;
    position: relative;
    width: 100%;
  }

  .people-list {
    flex-basis: content;
  }
</style>
