<template>
  <main>
    <modal-dialog
      v-show="showModal"
      @close="closeModal"
    >
      <person-select/>
    </modal-dialog>

    <div class="container">
      <section id="print-area">
        <plan-header/>
        <plan-seats/>
        <plan-footer/>
      </section>
      <persons-list/>
    </div>
  </main>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

// Components
import ModalDialog from '@/components/ModalDialog.vue'
import PersonSelect from '@/components/PersonSelect.vue'
import PersonsList from '@/components/PersonsList.vue'
import PlanFooter from './Footer'
import PlanHeader from './Header'
import PlanSeats from './Seats'

export default {
  name: 'SeatingPlanView',
  components: {
    ModalDialog,
    PersonSelect,
    PersonsList,
    PlanFooter,
    PlanHeader,
    PlanSeats
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
