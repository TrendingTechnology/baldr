<template>
  <main>

    <h1>As a link</h1>
    <material-icon href="https://de.wikipedia.org/wiki/Cloud_Computing" size="8vw" name="cloud"/>

    <h1>Outlines</h1>
    <p>
      <code>icon</code>:
      <material-icon outline="icon" size="8vw" name="cloud"/>
    </p>

    <p>
    <code>circle</code>:
    <material-icon outline="circle" size="8vw" name="cloud"/>
    </p>

    <p>
    <code>square</code>:
    <material-icon outline="square" size="8vw" name="cloud"/>
    </p>

    <h1>Display</h1>

    <p>
    <code>normal</code>:
    <material-icon display="normal" size="8vw" name="cloud"/>
    </p>

    <p>
    <code>disabled</code>:
    <material-icon display="disabled" size="8vw" name="cloud"/>
    </p>

    <p>
    <code>show-on-hover</code>:
    <material-icon display="show-on-hover" size="8vw" name="cloud"/>
    </p>

    <section class="available-icons">
      <h1>Available icons</h1>

      <div class="columns">
        <p
          v-for="icon in icons"
          :key="icon"
          :name="icon"
        >
          <material-icon :size="size" :name="icon"/>
          <span class="description">{{ icon }}</span>
        </p>
      </div>
    </section>

    <h1>Warning</h1>
    <material-icon class="red" :size="size" name="xxx"/>
  </main>
</template>

<script>
import { icons } from '@bldr/vue-component-material-icon'

export default {
  name: 'MaterialIconView',
  data () {
    return {
      size: '2.5vw'
    }
  },
  computed: {
    icons () {
      return icons
    }
  }
}
</script>

<style lang="scss" scoped>
  .available-icons {
    .columns {
      columns: 3;
    }

    .description {
      margin-left: 1vw;
    }

    .baldr-icons {
      transform: translate(0, 0.5vw)
    }
  }

</style>