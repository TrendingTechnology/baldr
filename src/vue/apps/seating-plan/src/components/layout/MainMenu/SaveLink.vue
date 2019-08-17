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

export default {
  name: 'SaveLink',
  computed: mapGetters([
    'stateChanged'
  ]),
  methods: mapActions([
    'save'
  ])
}
</script>
