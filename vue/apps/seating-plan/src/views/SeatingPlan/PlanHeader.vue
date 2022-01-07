<template>
  <header class="vc_plan_header">
    <h1>
      {{ title }}
    </h1>
    <div class="meta">
      <aside class="left">{{ metaLocation }}</aside>
      <aside class="right">
        <strong>Stand:</strong> {{ stateDateCurrent }}
      </aside>
    </div>
  </header>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { mapGetters } from 'vuex'

@Component({
  computed: {
    ...mapGetters([
      'gradeNameCurrent',
      'metaLocation',
      'metaYear',
      'stateDateCurrent'
    ])
  }
})
export default class PlanHeader extends Vue {
  gradeNameCurrent!: string
  metaYear!: string

  get title () {
    return `Sitzplan der Klasse „${this.gradeNameCurrent}“ (Schuljahr ${this.metaYear})`
  }
}
</script>

<style lang="scss">
.vc_plan_header {
  width: 100%;
  h1 {
    text-align: center;
    margin: 0;
  }

  .meta {
    display: flex;
  }

  .meta .left {
    flex-grow: 1;
  }

  .meta .right {
    text-align: right;
  }
}
</style>
