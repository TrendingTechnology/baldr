<template>
  <table class="vc_grades_table">
    <tr v-for="gradeName in gradeNames" :key="gradeName">
      <td
        contenteditable
        @blur="rename(gradeName, $event)"
      >
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

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'GradesTable',
  computed: mapGetters([
    'gradeNames',
    'isGradePlaced'
  ]),
  methods: {
    ...mapActions([
      'deleteGrade'
    ]),
    rename (oldGradeName, event) {
      const newGradeName = event.target.innerText
      this.$store.commit('renameGrade', {
        oldGradeName: oldGradeName,
        newGradeName: newGradeName
      })
    }
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
