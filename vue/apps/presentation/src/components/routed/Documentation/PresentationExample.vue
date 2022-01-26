<template>
  <section class="vc_presentation_example">
    <h2>
      Beispiel-Präsentation
      <router-link
        :to="{
          name: 'slides-preview',
          params: { presRef }
        }"
      >
        <material-icon name="presentation" />
      </router-link>
    </h2>

    <pre><code>{{ yamlMarkup }}</code></pre>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

@Component
export default class PresentationExample extends Vue {
  @Prop({
    type: String,
    required: true
  })
  presRef!: string

  @Prop({
    type: String,
    required: true
  })
  yamlMarkup!: string
}
</script>
