<template>
  <div class="vc_app_info_simple">
    <h2>Über die App „{{ packageName }}“</h2>

    <table>
      <tbody>
        <tr>
          <th>Paket-Name</th>
          <td>
            <a :href="`https://www.npmjs.com/package/${packageName}`">
              {{ packageName }}
            </a>
          </td>
        </tr>
        <tr>
          <th>Paket-Version</th>
          <td>
            <a :href="`https://www.npmjs.com/package/${packageName}`">
              {{ version }}
            </a>
          </td>
        </tr>
        <tr>
          <th>Git-Version</th>
          <td>
            <a
              :href="
                `https://github.com/Josef-Friedrich/baldr/commit/${gitHead.long}`
              "
            >
              {{ gitHead.short }}<span v-if="gitHead.isDirty">-dirty</span>
            </a>
          </td>
        </tr>
        <tr>
          <th>Zeitpunkt der Kompilierung</th>
          <td>{{ compilationTime }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
/* globals compilationTime gitHead */

import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { GitHead } from '@bldr/type-definitions'

@Component
export default class AppInfoSimple extends Vue {
  @Prop({
    required: true,
    type: String
  })
  packageName!: string

  @Prop({
    required: true,
    type: String
  })
  version!: string

  data () {
    return {
      gitHead: gitHead,
      compilationTime: new Date(compilationTime).toLocaleString()
    }
  }

  gitHead!: GitHead
  compilationTime!: string
}
</script>
