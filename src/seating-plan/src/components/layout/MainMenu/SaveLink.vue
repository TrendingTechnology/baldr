<template>
  <material-icon
    :display="!stateChanged ? 'disabled' : 'normal'"
    name="save"
    @click.native="save"
    title="speichern"
    class="vc_save_link"
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
