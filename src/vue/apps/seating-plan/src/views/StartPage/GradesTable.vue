<template>
  <table class="vc_grades_table">
    <tr v-for="gradeName in gradeNames" :key="gradeName">
      <td contenteditable @blur="rename(gradeName, $event)">
        {{ gradeName }}
      </td>

      <td>
        <router-link
          :to="{ name: 'seating-plan', params: { grade: gradeName } }"
        >
          <material-icon
            :title="`Sitzplan der Klasse „${gradeName}“ öffnen`"
            name="open-in-new"
          />
        </router-link>
      </td>

      <td>
        <router-link
          :to="{ name: 'administer-persons', params: { grade: gradeName } }"
        >
          <material-icon
            :title="`Klassenliste der Klasse „${gradeName}“ verwalten`"
            name="account-group"
          />
        </router-link>
      </td>

      <td>
        <material-icon
          name="delete"
          @click.native="deleteGrade(gradeName)"
          :title="`Klasse „${gradeName}“ löschen`"
        />
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { mapGetters, mapActions } from 'vuex'

import { DOMEvent } from '../../types'

@Component({
  computed: mapGetters(['gradeNames', 'isGradePlaced']),
  methods: {
    ...mapActions(['deleteGrade'])
  }
})
export default class GradesTable extends Vue {
  rename (oldGradeName: string, event: DOMEvent<HTMLInputElement>): void {
    const newGradeName = event.target.innerText
    this.$store.commit('renameGrade', {
      oldGradeName: oldGradeName,
      newGradeName: newGradeName
    })
  }
}
</script>

<style lang="scss">
.vc_grades_table {
  .placed {
    text-decoration: line-through;
    color: grey;
  }
}
</style>
