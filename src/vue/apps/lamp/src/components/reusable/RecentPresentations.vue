<template>
  <div class="vc_recent_presentations">
    <section v-if="recent.length">
      <h1>Kürzlich geöffnete Präsentationen</h1>
      <ul>
        <li v-for="(presInfo, index) in recent" :key="index">
          <router-link
            :to="{
              name: 'slides-preview',
              params: { presRef: presInfo.presRef }
            }"
            v-html="presInfo.title"
          />
        </li>
      </ul>
    </section>
  </div>
</template>

<script lang="ts">
import {
  createNamespacedHelpers,
  Vue,
  Component
} from '@bldr/vue-packages-bundler'
const { mapGetters, mapActions } = createNamespacedHelpers('lamp/recent')

@Component({
  computed: mapGetters(['recent']),
  methods: mapActions(['readFromLocalStorage'])
})
export default class RecentPresentations extends Vue {
  mounted () {
    if (!this.recent.length) {
      this.readFromLocalStorage()
    }
  }
}
</script>

<style lang="scss">
.vc_recent_presentations {
  box-sizing: border-box;
  font-size: 0.4em;
  position: absolute;
  bottom: 15%;
  left: 0;
  width: 100%;
  text-align: center;

  section {
    display: inline-block;
    text-align: left;
    padding: 0 auto;

    ul {
      padding-left: 1.5em;
      margin-top: 0.4em;
    }

    h1 {
      margin: 0em;
      padding: 0em;
    }
  }
}
</style>
