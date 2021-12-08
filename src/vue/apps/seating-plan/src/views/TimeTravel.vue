<template>
  <main class="vc_time_travel">
    <section class="external">
      <h1>Extern</h1>
      <table>
        <tr v-for="timeStampMsec in externalStateDates" :key="timeStampMsec">
          <td>
            <a
              href="#"
              @click.prevent="importFromExternalByTime(timeStampMsec)"
            >
              {{ formatToLocalDateTime(timeStampMsec) }}
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
        <tr v-for="timeStampMsec in localStateDates" :key="timeStampMsec">
          <td>
            <a href="#" @click.prevent="importFromLocalByTime(timeStampMsec)">
              {{ formatToLocalDateTime(timeStampMsec) }}
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

<script lang="ts">
import { formatToLocalDateTime } from '@bldr/core-browser'
import {
  Component,
  Vue,
  mapGetters,
  mapActions
} from '@bldr/vue-packages-bundler'

@Component({
  computed: mapGetters(['externalStateDates', 'localStateDates']),
  methods: {
    ...mapActions([
      'deleteFromExternalByTime',
      'deleteFromLocalByTime',
      'importFromExternalByTime',
      'importFromLocalByTime'
    ]),
    formatToLocalDateTime
  }
})
export default class TimeTravel extends Vue {
  beforeCreate () {
    this.$store.dispatch('fetchExternalStateDates')
    this.$store.dispatch('fetchLocalStateDates')
  }
}
</script>

<style lang="scss">
.vc_time_travel {
  display: flex;

  section {
    width: 100%;
  }
}
</style>
