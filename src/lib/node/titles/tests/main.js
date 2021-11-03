/* globals describe it */
const assert = require('assert')
const path = require('path')
const { DeepTitle } = require('../dist/node/deep-title.js')
const { TreeFactory } = require('../dist/node/tree-factory.js')

const { getConfig } = require('@bldr/config-ng')

const config = getConfig()

function makeDeepTitel (filePath) {
  return new DeepTitle(
    path.join(config.mediaServer.basePath, 'Musik', filePath)
  )
}

describe('Package “@bldr/titles”', function () {
  describe('Class “DeepTitle”', function () {
    it('07_Hoer-Labyrinth/TX/Arbeitsblatt.tex', function () {
      const deep = makeDeepTitel(
        '05/40_Grundlagen/97_Instrumente/07_Hoer-Labyrinth/TX/Arbeitsblatt.tex'
      )
      assert.strictEqual(deep.grade, 5)
      assert.strictEqual(deep.subject, 'Musik')
      assert.strictEqual(deep.ref, 'Hoer-Labyrinth')
      assert.strictEqual(deep.title, 'Hör-Labyrinth')
      assert.strictEqual(
        deep.allTitles,
        'Fach Musik / 5. Jahrgangsstufe / Lernbereich 4: Musik und ihre Grundlagen / Instrumente verschiedener Gruppen / Hör-Labyrinth'
      )
      assert.strictEqual(deep.subtitle, 'Instrumente des Sinfonieorchesters')

      assert.strictEqual(
        deep.curriculum,
        '5. Jahrgangsstufe / Lernbereich 4: Musik und ihre Grundlagen / Instrumente verschiedener Gruppen'
      )
      assert.strictEqual(
        deep.curriculumFromGrade,
        'Lernbereich 4: Musik und ihre Grundlagen / Instrumente verschiedener Gruppen'
      )

      assert.strictEqual(deep.titles[0].relPath, 'Musik')
      assert.strictEqual(deep.titles[1].relPath, 'Musik/05')
      assert.strictEqual(deep.titles[2].relPath, 'Musik/05/40_Grundlagen')
      assert.strictEqual(
        deep.titles[3].relPath,
        'Musik/05/40_Grundlagen/97_Instrumente'
      )
    })

    it('11/30_Politik/10_Lieder/10_Arbeiterlied-Weber/Praesentation.baldr.yml', function () {
      const deep = makeDeepTitel(
        '11/30_Politik/10_Lieder/10_Arbeiterlied-Weber/Praesentation.baldr.yml'
      )
      assert.strictEqual(deep.ref, 'Arbeiterlied-Weber')
      assert.strictEqual(deep.title, 'Ein Arbeiterlied des 19. Jahrhunderts')
      assert.strictEqual(
        deep.allTitles,
        'Fach Musik / 11. Jahrgangsstufe / Musik im Dienst politischer Ideen / Politische Lieder / Ein Arbeiterlied des 19. Jahrhunderts'
      )
      assert.strictEqual(
        deep.subtitle,
        '<em class="piece">Das Lied der schlesischen Weber</em> (1844)'
      )
    })

    it('11/30_Politik/10_Lieder/10_Arbeiterlied-Weber/', function () {
      const deep = makeDeepTitel(
        '11/30_Politik/10_Lieder/10_Arbeiterlied-Weber/'
      )
      assert.strictEqual(deep.ref, 'Arbeiterlied-Weber')
      assert.strictEqual(deep.grade, 11)
    })
  })

  describe('Class “TreeFactory”', function () {
    it('build', function () {
      const factory = new TreeFactory()

      function add (relPath) {
        factory.addTitleByPath(
          path.join(
            config.mediaServer.basePath,
            'Musik/06/40_Grundlagen/05_Intervalle-Feinbestimmung',
            relPath
          )
        )
      }

      add('10_Bach-Thema-regium/Praesentation.baldr.yml')
      add('20_Bach-Matthaus-Komm-suesses-Kreuz/Praesentation.baldr.yml')
      add('30_Intervalle-Bach-Inventionen/Praesentation.baldr.yml')
      add('Praesentation.baldr.yml')

      const tree = factory.getTree()

      assert.ok(
        tree.Musik.sub['06'].sub['40_Grundlagen'].sub[
          '05_Intervalle-Feinbestimmung'
        ].sub['10_Bach-Thema-regium'].folder.hasPresentation
      )

      assert.ok(
        tree.Musik.sub['06'].sub['40_Grundlagen'].sub[
          '05_Intervalle-Feinbestimmung'
        ].sub['20_Bach-Matthaus-Komm-suesses-Kreuz'].folder.hasPresentation
      )

      assert.ok(
        tree.Musik.sub['06'].sub['40_Grundlagen'].sub[
          '05_Intervalle-Feinbestimmung'
        ].sub['30_Intervalle-Bach-Inventionen'].folder.hasPresentation
      )

      assert.strictEqual(
        tree.Musik.sub['06'].sub['40_Grundlagen'].sub[
          '05_Intervalle-Feinbestimmung'
        ].folder.folderName,
        '05_Intervalle-Feinbestimmung'
      )
    })
  })
})
