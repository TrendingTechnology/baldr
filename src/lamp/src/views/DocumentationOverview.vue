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
          <tr
            v-for="(rawYaml, masterName) in examples.masters"
            :key="masterName"
          >
            <td><material-icon :name="$masters.get(masterName).icon.name" :color="$masters.get(masterName).icon.color"/></td>
            <td>
              <router-link :to="{ name: 'documentation-master', params: { master: masterName } }">
                {{ masterName }}
              </router-link>
            </td>
            <td>{{ $masters.get(masterName).title }}</td>
            <td>
              <material-icon
                name="presentation"
                @click.native="openExample(rawYaml)"
              />
            </td>
          </tr>
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
          <tr
            v-for="(example, exampleName) in examples.common"
            :key="exampleName"
          >
            <td>
              <router-link :to="{ name: 'common-example', params: { exampleName } }">
                {{ exampleName }}
              </router-link>
            </td>
            <td>
              <material-icon
                name="presentation"
                @click.native="openExample(example)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <section v-html="documentation">
    </section>
  </div>
</template>

<script>
import { markupToHtml, openPresentationByRawYaml } from '@/lib.js'

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

export default {
  name: 'DocumentationOverview',
  methods: {
    openExample (yamlString) {
      this.$store.commit('presentation/showMetaDataOverlay', true)
      openPresentationByRawYaml(yamlString)
    }
  },
  mounted: function () {
    this.$styleConfig.set({
      centerVertically: false
    })
  },
  computed: {
    documentation () {
      return markupToHtml(documentation)
    },
    examples () {
      return rawYamlExamples
    }
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
