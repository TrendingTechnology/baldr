<template>
  <div
    class="
      vc_documentation_overview
      main-app-padding
      main-app-fullscreen
    "
    b-ui-theme="default"
  >
    <!-- Documentation -->
    <h1>Dokumentation</h1>

    <section>
      <!-- Master slides -->
      <h2>Master-Folien</h2>

      <table>
        <thead>
          <tr>
            <td></td>
            <td>Master-ID</td>
            <!-- Title -->
            <td>Titel</td>
            <!-- Example -->
            <td>Beispiel-Präsentation</td>
          </tr>
        </thead>
        <tbody>
          <master-table-row
            :master-name="masterName"
            v-for="(rawYaml, masterName) in examples.masters"
            :key="masterName"
          />
        </tbody>
      </table>
    </section>

    <section>
      <h2>Allgemeine Beispiele</h2>

      <table>
        <thead>
          <tr>
            <!-- Title -->
            <td>Titel</td>
            <!-- Example -->
            <td>Beispiel-Präsentation</td>
          </tr>
        </thead>
        <tbody>
          <common-example-table-row
            :example-name="exampleName"
            v-for="(example, exampleName) in examples.common"
            :key="exampleName"
          />
        </tbody>
      </table>
    </section>

    <section v-html="documentation"></section>
  </div>
</template>

<script lang="ts">
/* global rawYamlExamples */

import Vue from 'vue'
import Component from 'vue-class-component'

import { convertMarkdownToHtml } from '@bldr/markdown-to-html'

import MasterTableRow from './MasterTableRow.vue'
import CommonExampleTableRow from './CommonExampleTableRow.vue'

const documentation = `

# Semantische CSS-Klassen

Können im YAML-Quellcode der Präsentationen eingesetzt werden.

* _.important_ (Sans-Schriftart, fett)
* _.note_ (kleinere Schriftgröße, linksbündig)
* _.person_ (Kapitälchen)
* _.piece_ (kursiv)
* _.genre_ (Monospace Schrift)
* _.term_ (fett, Sans-Schriftart)
* _.transparent-background_ (grauer Hintergrund der transparent ist)
`

@Component({ components: { MasterTableRow, CommonExampleTableRow } })
export default class DocumentationOverview extends Vue {
  get documentation (): string {
    return convertMarkdownToHtml(documentation)
  }

  get examples (): typeof rawYamlExamples {
    return rawYamlExamples
  }
}
</script>

<style lang="scss">
.vc_documentation_overview {
  font-size: 2vw;
  width: 100vw;
  height: 100vh;

  a {
    cursor: pointer;
  }

  table {
    width: 100%;

    tbody {
      tr:hover {
        background-color: scale-color($gray, $lightness: 70%);
      }
    }
  }
}
</style>
