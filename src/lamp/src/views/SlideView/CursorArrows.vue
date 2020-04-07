<template>
  <div class="vc_cursor_arrows">
    <plain-icon
      name="chevron-up"
      class="up"
      @click.native="up"
    />
    <plain-icon
      name="chevron-right"
      class="right"
      @click.native="right"
    />
    <plain-icon
      name="chevron-down"
      class="down"
      @click.native="down"
    />
    <plain-icon
      name="chevron-left"
      class="left"
      @click.native="left"
    />
  </div>
</template>

<script>
export default {
  name: 'CursorArrows',
  methods: {
    up () {
      console.log('up')
    },
    right () {
      console.log('right')
    },
    down () {
      console.log('down')
    },
    left () {
      console.log('left')
    }
  }
}
</script>

<style lang="scss">
  .vc_cursor_arrows {
    //border: 3px solid $blue;
    bottom: 0.5vw;
    box-sizing: border-box;
    color: $green;
    font-size: 4vw;
    height: 2.1em;
    opacity: 0.2;
    position: fixed;
    right: 0.5vw;
    width: 2.1em;

    .baldr-icon {
      position: absolute;
      box-sizing: border-box;
      //border: 1px solid $yellow
    }

    .up {
      top: 0em;
      left: 0.5em;
    }

    .right {
      top: 0.5em;
      left: 1em;
    }

    .down {
      top: 1em;
      left: 0.5em;
    }

    .left {
      top: 0.5em;
      left: 0em;
    }
  }
</style>
