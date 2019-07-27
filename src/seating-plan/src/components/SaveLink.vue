<template>
  <material-icon
    :disabled="!stateChanged"
    name="content-save"
    @click.native="save"
    title="lokal speichern"
  />
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

// Components
import MaterialIcon from './MaterialIcon.vue'

export default {
  name: 'SaveLink',
  components: {
    MaterialIcon
  },
  computed: mapGetters(['stateChanged']),
  methods: mapActions(['save'])
}
</script>
