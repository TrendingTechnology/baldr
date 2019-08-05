<template>
  <material-icon
    :disabled="!stateChanged"
    name="content-save"
    @click.native="save"
    title="speichern"
  />
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

// Components
import { MaterialIcon } from '@bldr/vue-components'

export default {
  name: 'SaveLink',
  components: {
    MaterialIcon
  },
  computed: mapGetters([
    'stateChanged'
  ]),
  methods: mapActions([
    'save'
  ])
}
</script>
