<template>
  <main>
    <modal-dialog name="person-select">
      <person-select/>
    </modal-dialog>

    <div class="container">
      <section id="print-area">
        <plan-header/>
        <plan-seats/>
        <plan-footer/>
      </section>
      <persons-sidebar/>
    </div>
  </main>
</template>

<script>
import { mapGetters } from 'vuex'

// Components
import PersonSelect from '@/components/PersonSelect'
import PersonsSidebar from './PersonsSidebar'
import PlanFooter from './Footer'
import PlanHeader from './Header'
import PlanSeats from './Seats'

export default {
  name: 'SeatingPlanView',
  components: {
    PersonSelect,
    PersonsSidebar,
    PlanFooter,
    PlanHeader,
    PlanSeats
  },
  computed: mapGetters([
    'gradeNameCurrent'
  ]),
  beforeCreate: function () {
    const grade = this.$route.params.grade
    if (!this.$store.getters.grade(grade)) {
      this.$router.push('/')
    }
  },
  created: function () {
    const gradeName = this.$route.params.grade
    this.$store.commit('setGradeNameCurrent', gradeName)
  },
  beforeRouteUpdate (to, from, next) {
    this.$store.commit('setGradeNameCurrent', to.params.grade)
    next()
  }
}
</script>

<style scoped>
  .container {
    display: flex;
    align-items: stretch;
    position: relative;
    width: 100%;
  }

  .container > section {
    width: 100%;
  }

  .people-list {
    flex-basis: content;
  }
</style>
