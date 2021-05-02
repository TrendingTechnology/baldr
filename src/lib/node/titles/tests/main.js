const assert = require('assert')

const { DeepTitle } = require('../dist/node/main.js')

describe('Package “@bldr/titles”', function () {
  it('07_Hoer-Labyrinth/TX/Arbeitsblatt.tex', function () {
    const deep = new DeepTitle('/home/jf/schule-media/05/40_Grundlagen/97_Instrumente/07_Hoer-Labyrinth/TX/Arbeitsblatt.tex')
    assert.strictEqual(deep.ref, 'Hoer-Labyrinth')
    assert.strictEqual(deep.title, 'Hör-Labyrinth')
    assert.strictEqual(deep.allTitles, '5. Jahrgangsstufe / Lernbereich 4: Musik und ihre Grundlagen / Instrumente verschiedener Gruppen / Hör-Labyrinth')
    assert.strictEqual(deep.subtitle, 'Instrumente des Sinfonieorchesters')
    assert.strictEqual(deep.titles[0].relPath, '05')
    assert.strictEqual(deep.titles[1].relPath, '05/40_Grundlagen')
    assert.strictEqual(deep.titles[2].relPath, '05/40_Grundlagen/97_Instrumente')
  })

  it('11/30_Politik/10_Lieder/10_Arbeiterlied-Weber/Praesentation.baldr.yml', function () {
    const deep = new DeepTitle('/home/jf/schule-media/11/30_Politik/10_Lieder/10_Arbeiterlied-Weber/Praesentation.baldr.yml')
    assert.strictEqual(deep.ref, 'Arbeiterlied-Weber')
    assert.strictEqual(deep.title, 'Ein Arbeiterlied des 19. Jahrhunderts')
    assert.strictEqual(deep.allTitles, '11. Jahrgangsstufe / Musik im Dienst politischer Ideen / Politische Lieder / Ein Arbeiterlied des 19. Jahrhunderts')
    assert.strictEqual(deep.subtitle, '<em class="piece">Das Lied der schlesischen Weber</em> (1844)')
  })

  it('11/30_Politik/10_Lieder/10_Arbeiterlied-Weber/', function () {
    const deep = new DeepTitle('/home/jf/schule-media/11/30_Politik/10_Lieder/10_Arbeiterlied-Weber/')
    assert.strictEqual(deep.ref, 'Arbeiterlied-Weber')
    assert.strictEqual(deep.grade, 11)
  })
})
