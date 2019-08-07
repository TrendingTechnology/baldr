<template>
  <div>
    <material-icon
      :size="size"
      @click.native="clickWrapper('clickLeft')"
      name="chevron-left"
      title="Vorhergehende Seite (Tastenkürzel: linke Pfeiltaste)"
    />
    <material-icon
      :size="size"
      @click.native="clickWrapper('clickRight')"
      name="chevron-right"
      title="Nächste Seite (Tastenkürzel: rechte Pfeiltaste)"
    />
    <material-icon
      :size="size"
      @click.native="clickWrapper('clickUp')"
      name="chevron-up"
    />
    <material-icon
      :size="size"
      @click.native="clickWrapper('clickDown')"
      name="chevron-down"
    />
  </div>
</template>

<script>
import MaterialIcon from './MaterialIcon'

export default {
  name: 'CursorCross',
  props: {
    clickLeft: {
      type: Function
    },
    clickRight: {
      type: Function
    },
    clickUp: {
      type: Function
    },
    clickDown: {
      type: Function
    },
    size: {
      type: String
    }
  },
  methods: {
    clickWrapper (funcName) {
      if (typeof this[funcName] === 'function') {
        this[funcName]()
      }
    }
  },
  components: {
    MaterialIcon
  }
}
</script>

<style>

</style>
