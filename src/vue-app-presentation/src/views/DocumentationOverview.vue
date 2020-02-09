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
            v-for="(master, masterName) in $masters.all"
            :key="masterName"
          >
            <td><material-icon :name="master.icon.name" :color="master.icon.color"/></td>
            <td>
              <router-link :to="{ name: 'documentation-master', params: { master: masterName } }">
                {{ masterName }}
              </router-link>
            </td>
            <td>{{ master.title }}</td>
            <td>
              <material-icon
                v-if="master.example"
                name="presentation"
                @click.native="openExample(master.example)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <section>
      <h2>Beispiele</h2>

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
            v-for="(example, exampleName) in examples"
            :key="exampleName"
          >
            <td>{{ exampleName }}</td>
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
import {  markupToHtml } from '@/lib.js'

const documentation = `

# Semantische CSS-Klassen

Können im YAML-Quellcode der Präsentationen eingesetzt werden.

* _.important_ (Sans-Schriftart, fett)
* _.note_ (kleinere Schriftgröße, linksbündig)
* _.person_ (Kapitälchen)
* _.piece_ (kursiv)
`

export default {
  name: 'DocumentationOverview',
  methods: {
    openExample (yamlString) {
      this.$store.dispatch('presentation/openPresentation', { rawYamlString: yamlString }).then(() => {
        if (this.$route.name !== 'slides') this.$router.push({ name: 'slides' })
      })
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

<style lang="scss" scoped>
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
