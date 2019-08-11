<template>
  <div class="cursor-cross">
    <material-icon
      :size="size"
      :title="leftTitle"
      @click.native="left"
      name="chevron-left"
      v-if="left"
    />
    <material-icon
      :size="size"
      :title="rightTitle"
      @click.native="right"
      name="chevron-right"
      v-if="right"
    />
    <material-icon
      :size="size"
      :title="upTitle"
      @click.native="up"
      name="chevron-up"
      v-if="up"
    />
    <material-icon
      :size="size"
      :title="downTitle"
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
    down: {
      type: Function
    },
    downTitle: {
      type: String,
      default: null
    },
    left: {
      type: Function
    },
    leftTitle: {
      type: String,
      default: null
    },
    right: {
      type: Function
    },
    rightTitle: {
      type: String,
      default: null
    },
    size: {
      type: String
    },
    up: {
      type: Function
    },
    upTitle: {
      type: String,
      default: null
    },
  },
  components: {
    MaterialIcon
  }
}
</script>

<style>

</style>
