const assert = require('assert')

const { DeepTitle } = require('../dist/node/main.js')

describe('Package “@bldr/titles”', function () {
    it('07_Hoer-Labyrinth/TX/Arbeitsblatt.tex', function () {
      const deep = new DeepTitle('/home/jf/schule-media/05/40_Grundlagen/97_Instrumente/07_Hoer-Labyrinth/TX/Arbeitsblatt.tex')
      assert.strictEqual(deep.id, 'Hoer-Labyrinth')
      assert.strictEqual(deep.title, 'Hör-Labyrinth')
      assert.strictEqual(deep.allTitles, '5. Jahrgangsstufe / Lernbereich 4: Musik und ihre Grundlagen / Instrumente verschiedener Gruppen / Hör-Labyrinth')
      assert.strictEqual(deep.subtitle, 'Instrumente des Sinfonieorchesters')
    })
})
