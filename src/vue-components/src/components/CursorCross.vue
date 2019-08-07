<template>
  <div>
    <material-icon
      :size="size"
      @click.native="left"
      name="chevron-left"
      title="Vorhergehende Seite (Tastenkürzel: linke Pfeiltaste)"
      v-if="left"
    />
    <material-icon
      :size="size"
      @click.native="right"
      name="chevron-right"
      title="Nächste Seite (Tastenkürzel: rechte Pfeiltaste)"
      v-if="right"
    />
    <material-icon
      :size="size"
      @click.native="up"
      name="chevron-up"
      v-if="up"
    />
    <material-icon
      :size="size"
      @click.native="down"
      name="chevron-down"
      v-if="down"
    />
  </div>
</template>

<script>
import MaterialIcon from './MaterialIcon'

export default {
  name: 'CursorCross',
  props: {
    left: {
      type: Function
    },
    right: {
      type: Function
    },
    up: {
      type: Function
    },
    down: {
      type: Function
    },
    size: {
      type: String
    }
  },
  components: {
    MaterialIcon
  }
}
</script>

<style>

</style>
