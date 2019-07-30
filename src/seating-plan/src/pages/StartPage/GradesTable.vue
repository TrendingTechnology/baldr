<template>
  <table :class="{ inline: inline }" >
    <tr v-for="gradeName in gradeNames" :key="gradeName">
      <td
        contenteditable
        @blur="rename(gradeName, $event)"
      >
        {{ gradeName }}
      </td>

      <td>
        <router-link :to="'/grade/' + gradeName">
          <material-icon name="open-in-new"/>
        </router-link>
      </td>

      <td>
        <material-icon
          name="delete"
          @click.native="deleteGrade(gradeName)"
        />
      </td>
    </tr>
  </table>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

// Components
import MaterialIcon from '@/components/MaterialIcon'

export default {
  name: 'GradesTable',
  computed: mapGetters([
    'gradeNames',
    'isGradePlaced'
  ]),
  components: {
    MaterialIcon
  },
  methods: {
    ...mapActions(['deleteGrade']),
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

<style scoped>
  .placed {
    text-decoration: line-through;
    color: grey;
  }
</style>
