<template>
  <main>
    <section class="external">
      <h1>Extern</h1>
      <table>
        <tr
          v-for="timeStampMsec in externalStateDates"
          :key="timeStampMsec"
        >
          <td>
            <a href="#" @click.prevent="importFromExternalByTime(timeStampMsec)">
              {{ toLocaleDateTimeString(timeStampMsec) }}
            </a>
          </td>
          <td>
            <material-icon
              name="delete"
              @click.native="deleteFromExternalByTime(timeStampMsec)"
            />
          </td>
        </tr>
      </table>
    </section>

    <section class="local">
      <h1>Lokal</h1>
      <table>
        <tr
          v-for="timeStampMsec in localStateDates"
          :key="timeStampMsec"
        >
          <td>
            <a href="#" @click.prevent="importFromLocalByTime(timeStampMsec)">
              {{ toLocaleDateTimeString(timeStampMsec) }}
            </a>
          </td>
          <td>
            <material-icon
              name="delete"
              @click.native="deleteFromLocalByTime(timeStampMsec)"
            />
          </td>
        </tr>
      </table>
    </section>
  </main>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { toLocaleDateTimeString } from '../lib.js'

// Components
import MaterialIcon from '@/components/MaterialIcon'

export default {
  name: 'TimeTravel',
  components: {
    MaterialIcon
  },
  computed: mapGetters([
    'externalStateDates',
    'localStateDates'
  ]),
  beforeCreate: function () {
    this.$store.dispatch('fetchExternalStateDates')
    this.$store.dispatch('fetchLocalStateDates')
  },
  methods: {
    ...mapActions([
      'deleteFromExternalByTime',
      'deleteFromLocalByTime',
      'importFromExternalByTime',
      'importFromLocalByTime'
    ]),
    toLocaleDateTimeString
  }
}
</script>

<style scoped>
  main {
    display: flex;
  }

  section {
    width: 100%;
  }
</style>
