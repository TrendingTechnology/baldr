<template>
  <main>

    <h1>As a link</h1>

    <material-icon href="https://de.wikipedia.org/wiki/Cloud_Computing" name="cloud"/>

    <material-icon circle name="cloud"/>

    <material-icon square name="cloud"/>

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

    <section class="circle-icons">
      <h1>Circle icons</h1>
      <p
        v-for="icon in icons"
        :key="icon"
        :name="icon"
      >
        <circle-icon :icon="icon"/>
      </p>
    </section>

    <h1>Warning</h1>
    <material-icon class="red" :size="size" name="xxx"/>
  </main>
</template>

<script>
import { icons } from '@bldr/vue-component-material-icon'
import MarkupSample from '@/components/MarkupSample'

export default {
  name: 'MaterialIconView',
  components: {
    MarkupSample
  },
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

  .circle-icons {
    columns: 2;
  }

</style>