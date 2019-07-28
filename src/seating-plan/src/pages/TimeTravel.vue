<template>
  <div>
    <heading-title title="Zeitreise"/>

    <main>
      <section class="external">
        <h1>Extern</h1>
        <ul>
          <li
            v-for="timeStampMsec in externalStateDates"
            :key="timeStampMsec"
          >
            <a href="#" @click.prevent="importFromExternalByTime(timeStampMsec)">
              {{ toLocaleDateTimeString(timeStampMsec) }}
            </a>
            <material-icon
              name="delete"
              @click.native="deleteFromExternalByTime(timeStampMsec)"
            />
          </li>
        </ul>
      </section>

      <section class="local">
        <h1>Lokal</h1>
        <ul>
          <li
            v-for="timeStampMsec in localStateDates"
            :key="timeStampMsec"
          >
            <a href="#" @click.prevent="importFromLocalByTime(timeStampMsec)">
              {{ toLocaleDateTimeString(timeStampMsec) }}
            </a>
            <material-icon
              name="delete"
              @click.native="deleteFromLocalByTime(timeStampMsec)"
            />
          </li>
        </ul>
      </section>
    </main>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { toLocaleDateTimeString } from '../lib.js'

// Components
import HeadingTitle from '@/components/HeadingTitle'
import MaterialIcon from '@/components/MaterialIcon'

export default {
  name: 'TimeTravel',
  components: {
    HeadingTitle,
    MaterialIcon
  },
  computed: mapGetters(['externalStateDates', 'localStateDates']),
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
