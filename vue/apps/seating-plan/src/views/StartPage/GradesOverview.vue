<template>
  <div class="vc_grades_overview">
    <grades-table />
    <form @submit.prevent="createGrade">
      <input
        @keyup.enter="createGrade"
        placeholder="Klasse"
        type="text"
        size="8"
        v-model="gradeName"
      />
      <button>hinzufügen</button>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
// Components
import GradesTable from './GradesTable.vue'

@Component({
  components: {
    GradesTable
  }
})
export default class GradesOverview extends Vue {
  gradeName = ''

  createGrade (): void {
    if (this.gradeName) {
      this.$store.dispatch('createGrade', this.gradeName)
      this.gradeName = ''
    }
  }
}
</script>
