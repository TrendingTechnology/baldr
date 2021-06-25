/* globals describe it */
const assert = require('assert')
const path = require('path')
const { DeepTitle } = require('../dist/node/deep-title.js')
const { TreeFactory } = require('../dist/node/tree-factory.js')

const config = require('@bldr/config')

function makeDeepTitel (filePath) {
  return new DeepTitle(path.join(config.mediaServer.basePath, filePath))
}

describe('Package “@bldr/titles”', function () {
  describe('Class “DeepTitle”', function () {
    it('07_Hoer-Labyrinth/TX/Arbeitsblatt.tex', function () {
      const deep = makeDeepTitel('05/40_Grundlagen/97_Instrumente/07_Hoer-Labyrinth/TX/Arbeitsblatt.tex')
      assert.strictEqual(deep.ref, 'Hoer-Labyrinth')
      assert.strictEqual(deep.title, 'Hör-Labyrinth')
      assert.strictEqual(deep.allTitles, '5. Jahrgangsstufe / Lernbereich 4: Musik und ihre Grundlagen / Instrumente verschiedener Gruppen / Hör-Labyrinth')
      assert.strictEqual(deep.subtitle, 'Instrumente des Sinfonieorchesters')
      assert.strictEqual(deep.titles[0].relPath, '05')
      assert.strictEqual(deep.titles[1].relPath, '05/40_Grundlagen')
      assert.strictEqual(deep.titles[2].relPath, '05/40_Grundlagen/97_Instrumente')
    })

    it('11/30_Politik/10_Lieder/10_Arbeiterlied-Weber/Praesentation.baldr.yml', function () {
      const deep = makeDeepTitel('11/30_Politik/10_Lieder/10_Arbeiterlied-Weber/Praesentation.baldr.yml')
      assert.strictEqual(deep.ref, 'Arbeiterlied-Weber')
      assert.strictEqual(deep.title, 'Ein Arbeiterlied des 19. Jahrhunderts')
      assert.strictEqual(deep.allTitles, '11. Jahrgangsstufe / Musik im Dienst politischer Ideen / Politische Lieder / Ein Arbeiterlied des 19. Jahrhunderts')
      assert.strictEqual(deep.subtitle, '<em class="piece">Das Lied der schlesischen Weber</em> (1844)')
    })

    it('11/30_Politik/10_Lieder/10_Arbeiterlied-Weber/', function () {
      const deep = makeDeepTitel('11/30_Politik/10_Lieder/10_Arbeiterlied-Weber/')
      assert.strictEqual(deep.ref, 'Arbeiterlied-Weber')
      assert.strictEqual(deep.grade, 11)
    })
  })

  describe('Class “TreeFactory”', function () {
    it('build', function () {
      const factory = new TreeFactory()

      function add (relPath) {
        factory.addTitleByPath(path.join(config.mediaServer.basePath, '06/40_Grundlagen/05_Intervalle-Feinbestimmung', relPath))
      }

      add('10_Bach-Thema-regium/Praesentation.baldr.yml')
      add('20_Bach-Matthaus-Komm-suesses-Kreuz/Praesentation.baldr.yml')
      add('30_Intervalle-Bach-Inventionen/Praesentation.baldr.yml')
      add('Praesentation.baldr.yml')

      const tree = factory.getTree()

      assert.ok(
        tree['06']
          .sub['40_Grundlagen']
          .sub['05_Intervalle-Feinbestimmung']
          .sub['10_Bach-Thema-regium'].folder.hasPraesentation
      )

      assert.ok(
        tree['06']
          .sub['40_Grundlagen']
          .sub['05_Intervalle-Feinbestimmung']
          .sub['20_Bach-Matthaus-Komm-suesses-Kreuz'].folder.hasPraesentation
      )

      assert.ok(
        tree['06']
          .sub['40_Grundlagen']
          .sub['05_Intervalle-Feinbestimmung']
          .sub['30_Intervalle-Bach-Inventionen'].folder.hasPraesentation
      )

      assert.strictEqual(
        tree['06']
          .sub['40_Grundlagen']
          .sub['05_Intervalle-Feinbestimmung'].folder.folderName, '05_Intervalle-Feinbestimmung'
      )
    })
  })
})
