<template>
  <table class="vc_meta_table">
    <tr>
      <td><span class="important">Schule</span></td>
      <td contenteditable @blur="setMeta('location', $event)">
        {{ getMeta('location') }}
      </td>
    </tr>
    <tr>
      <td><span class="important">Schuljahr</span></td>
      <td contenteditable @blur="setMeta('year', $event)">
        {{ getMeta('year') }}
      </td>
    </tr>
    <tr>
      <td><span class="important">Lehrer</span></td>
      <td contenteditable @blur="setMeta('teacher', $event)">
        {{ getMeta('teacher') }}
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { DOMEvent } from '../../types'

@Component
export default class MetaTable extends Vue {
  getMeta (key: string): string {
    const value = this.$store.getters.meta(key)
    if (!value) return '_'
    return value
  }

  setMeta (key: string, event: DOMEvent<HTMLInputElement>): void {
    if (!event) return
    const value = event.target.innerText
    this.$store.commit('setMeta', {
      key: key,
      value: value
    })
  }
}
</script>
