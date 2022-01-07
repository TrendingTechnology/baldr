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
import Vue from 'vue'
import Component from 'vue-class-component'
import { mapGetters, mapActions } from 'vuex'

@Component({
  computed: mapGetters(['stateChanged']),
  methods: mapActions(['save'])
})
export default class SaveLink extends Vue {}
</script>
