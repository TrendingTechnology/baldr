<template>
  <div>
    <h2>Outlines</h2>
    <p>
      <code>icon</code>:
      <material-icon outline="icon" name="cloud" />
    </p>

    <p>
      <code>circle</code>:
      <material-icon outline="circle" name="cloud" />
    </p>

    <p>
      <code>square</code>:
      <material-icon outline="square" name="cloud" color="green"/>
    </p>

    <h2>Display</h2>

    <p>
      <code>normal</code>:
      <material-icon display="normal" name="cloud" />
    </p>

    <p>
      <code>disabled</code>:
      <material-icon display="disabled" name="cloud" />
    </p>

    <p>
      <code>show-on-hover</code>:
      <material-icon display="show-on-hover" name="cloud" />
    </p>

    <h2>Warning</h2>
    <material-icon class="red" name="xxx" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import MaterialIcon from '@/components/plugin/MaterialIcon.vue'

@Component({ components: { MaterialIcon } })
export default class AllStyles extends Vue {}
</script>
