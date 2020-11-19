<template>
  <material-icon
    :display="!stateChanged ? 'disabled' : 'normal'"
    name="save"
    @click.native="save"
    title="speichern"
    class="vc_save_link"
  />
</template>

<script lang="ts">
import { mapGetters, mapActions } from 'vuex'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  computed: mapGetters([
    'stateChanged'
  ]),
  methods: mapActions([
    'save'
  ])
})
export default class SaveLink extends Vue {}
</script>
