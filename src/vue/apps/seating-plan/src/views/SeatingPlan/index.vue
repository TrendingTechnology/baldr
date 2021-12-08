<template>
  <main class="vc_seating_plan">
    <modal-dialog name="person-select">
      <person-select />
    </modal-dialog>

    <div class="container">
      <section id="print-area">
        <plan-header />
        <plan-seats />
        <plan-footer />
      </section>
      <persons-sidebar />
    </div>
  </main>
</template>

<script lang="ts">
import {
  mapGetters,
  Component,
  Vue,
  Route,
  NavigationGuardNext
} from '@bldr/vue-packages-bundler'

import PersonSelect from '@/components/PersonSelect.vue'
import PersonsSidebar from './PersonsSidebar.vue'
import PlanFooter from './PlanFooter.vue'
import PlanHeader from './PlanHeader.vue'
import PlanSeats from './PlanSeats.vue'

@Component({
  components: {
    PersonSelect,
    PersonsSidebar,
    PlanFooter,
    PlanHeader,
    PlanSeats
  },
  computed: mapGetters(['gradeNameCurrent'])
})
export default class SeatingPlanView extends Vue {
  beforeCreate () {
    const grade = this.$route.params.grade
    if (!this.$store.getters.grade(grade)) {
      this.$router.push('/')
    }
  }

  created () {
    const gradeName = this.$route.params.grade
    this.$store.commit('setGradeNameCurrent', gradeName)
  }

  beforeRouteUpdate (to: Route, from: Route, next: NavigationGuardNext) {
    console.log(to)
    this.$store.commit('setGradeNameCurrent', to.params.grade)
    next()
  }
}
</script>

<style lang="scss">
.vc_seating_plan {
  .container {
    display: flex;
    align-items: stretch;
    position: relative;
    width: 100%;
  }

  .container > section {
    width: 100%;
  }

  .vc_person_select {
    flex-basis: content;
  }
}
</style>
