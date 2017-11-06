const {
  assert,
  fs,
  path,
  Spectron
} = require('baldr-test');

describe('General Spectron tests', () => {

  describe('build', () => {

    it(`exists “Spectron.appPath”`, () => {
      let spectron = new Spectron();
      assert.ok(fs.existsSync(spectron.appPath));
    });

  });

  describe('Lauch without baldr file', function () {
    this.timeout(10000);

    beforeEach(function () {
      this.spectron = new Spectron();
      this.app = this.spectron.getApp();
      return this.spectron.start();
    });

    afterEach(function () {
      return this.spectron.stop();
    });


    it('Initial window', function () {
      return this.app.client
        .getWindowCount()
        .then(count => {
          assert.equal(count, 1);
        })
        .getTitle()
        .then(text => {
          assert.equal(text, 'baldr');
        })
        .getText('#slide').then(text => {
          assert.ok(text.includes('Uncaught Error: No presentation file with the extension *.baldr found!'));
        });

    });

  });


  describe('Launch minimal.baldr', function () {
    this.timeout(10000);

    beforeEach(function () {
      this.spectron = new Spectron('test/files/minimal.baldr');
      this.app = this.spectron.getApp();
      return this.spectron.start();
    });

    afterEach(function () {
      return this.spectron.stop();
    });

    it('Initial window', function () {
      return this.app.client
        .getText('.author').then(text => {
          assert.equal(text, 'Johann Wolfgang von Goethe');
        })
        .getCssProperty('.author', 'font-family').then(style => {
          assert.equal(style.value, 'alegreya sc');
        })
        .getCssProperty('button', 'color').then(style => {
          assert.equal(style[0].parsed.hex, '#0000ff');
        })

        .click('#nav-slide-next')
        .getText('.question')
        .then(text => {
          assert.equal(text, 'When did Ludwig van Beethoven die?');
        })

        .click('#nav-slide-next')
        .getText('p')
        .then(text => {
          assert.equal(text, 'Ludwig van Beethoven');
        });
    });

    it('Shortcuts', function () {
      return this.app.client

        .keys('ArrowRight')
        .getText('.question')
        .then(text => {
          assert.equal(text, 'When did Ludwig van Beethoven die?');
        })

        .keys('ArrowRight')
        .getText('p')
        .then(text => {
          assert.equal(text, 'Ludwig van Beethoven');
        })

        .keys('c')
        .getHTML('video')
        .then(text => {
          assert.ok(text.includes('<video'));
        })

        .keys('e')
        .getText('#slide')
        .then(text => {
          assert.equal(text, 'editor');
        })

        ;
    });

    it('Modal window', function () {
      return this.app.client

        .click('#modal-open button')
        .getCssProperty('#modal', 'display').then(style => {
          assert.equal(style.value, 'block');
        })

        .click('#modal-open button')
        .getCssProperty('#modal', 'display').then(style => {
          assert.equal(style.value, 'none');
        })

        .click('#modal-open button')
        .getCssProperty('#modal', 'display').then(style => {
          assert.equal(style.value, 'block');
        })

        .click('#modal-close')
        .getCssProperty('#modal', 'display').then(style => {
          assert.equal(style.value, 'none');
        })

        .keys('Escape')
        .getCssProperty('#modal', 'display').then(style => {
          assert.equal(style.value, 'block');
        })

        .keys('Escape')
        .getCssProperty('#modal', 'display').then(style => {
          assert.equal(style.value, 'none');
        })

        ;
    });

  });

  describe('Launch steps.baldr', function () {
    this.timeout(10000);

    beforeEach(function () {
      this.spectron = new Spectron('test/files/steps.baldr');
      this.app = this.spectron.getApp();
      return this.spectron.start();
    });

    afterEach(function () {
      return this.spectron.stop();
    });

    it('General step functionality, nextStep', function () {
      return this.app.client
        .getText('li:nth-child(1) .question').then(text => {
          assert.equal(text, 'one');
        })
        .getText('li:nth-child(2) .question').then(text => {
          assert.equal(text, '');
        })
        .getText('li:nth-child(3) .question').then(text => {
          assert.equal(text, '');
        })

        .click('#nav-step-next')
        .getText('li:nth-child(2) .question').then(text => {
          assert.equal(text, 'two');
        })

        .click('#nav-step-next')
        .getText('li:nth-child(3) .question').then(text => {
          assert.equal(text, 'three');
        })

        .keys('ArrowDown')
        .getText('li:nth-child(1) .question').then(text => {
          assert.equal(text, 'one');
        })
        .getText('li:nth-child(2) .question').then(text => {
          assert.equal(text, '');
        })
        .getText('li:nth-child(3) .question').then(text => {
          assert.equal(text, '');
        })

        ;
    });

    it('prevStep', function () {
      return this.app.client
        .click('#nav-step-prev')
        .getText('li:nth-child(1) .question').then(text => {
          assert.equal(text, 'one');
        })
        .getText('li:nth-child(2) .question').then(text => {
          assert.equal(text, 'two');
        })
        .getText('li:nth-child(3) .question').then(text => {
          assert.equal(text, 'three');
        })

        .click('#nav-step-prev')
        .getText('li:nth-child(3) .question').then(text => {
          assert.equal(text, '');
        })

        .click('#nav-step-prev')
        .getText('li:nth-child(2) .question').then(text => {
          assert.equal(text, '');
        })

        .keys('ArrowUp')
        .getText('li:nth-child(1) .question').then(text => {
          assert.equal(text, 'one');
        })
        .getText('li:nth-child(2) .question').then(text => {
          assert.equal(text, 'two');
        })
        .getText('li:nth-child(3) .question').then(text => {
          assert.equal(text, 'three');
        })

        ;
    });

    it('Step number is perserved on slide change', function () {
      return this.app.client
        .click('#nav-step-next')
        .getText('li:nth-child(1) .question').then(text => {
          assert.equal(text, 'one');
        })
        .getText('li:nth-child(2) .question').then(text => {
          assert.equal(text, 'two');
        })
        .getText('li:nth-child(3) .question').then(text => {
          assert.equal(text, '');
        })

        .click('#nav-slide-next')
        .getText('.question').then(text => {
          assert.equal(text, 'Without steps');
        })

        .click('#nav-slide-prev')
        .getText('li:nth-child(1) .question').then(text => {
          assert.equal(text, 'one');
        })
        .getText('li:nth-child(2) .question').then(text => {
          assert.equal(text, 'two');
        })
        .getText('li:nth-child(3) .question').then(text => {
          assert.equal(text, '');
        })

        ;
    });

    it('Visibility of the step buttons', function () {
      return this.app.client
        .getCssProperty('#nav-step-next', 'visibility').then(style => {
          assert.equal(style.value, 'visible');
        })
        .getCssProperty('#nav-step-prev', 'visibility').then(style => {
          assert.equal(style.value, 'visible');
        })
        .getCssProperty('#nav-slide-prev', 'visibility').then(style => {
          assert.equal(style.value, 'visible');
        })
        .getCssProperty('#nav-slide-next', 'visibility').then(style => {
          assert.equal(style.value, 'visible');
        })

        .click('#nav-slide-next')
        .getCssProperty('#nav-step-next', 'visibility').then(style => {
          assert.equal(style.value, 'hidden');
        })
        .getCssProperty('#nav-step-prev', 'visibility').then(style => {
          assert.equal(style.value, 'hidden');
        })

        .click('#nav-slide-prev')
        .getCssProperty('#nav-step-next', 'visibility').then(style => {
          assert.equal(style.value, 'visible');
        })
        .getCssProperty('#nav-step-prev', 'visibility').then(style => {
          assert.equal(style.value, 'visible');
        })

        ;
    });

  });

  describe('Launch single-slide.baldr', function () {
    this.timeout(10000);

    beforeEach(function () {
      this.spectron = new Spectron('test/files/single-slide.baldr');
      this.app = this.spectron.getApp();
      return this.spectron.start();
    });

    afterEach(function () {
      return this.spectron.stop();
    });

    it('Navigation buttons are hidden', function () {
      return this.app.client
        .getCssProperty('#nav-slide-prev', 'visibility').then(style => {
          assert.equal(style.value, 'hidden');
        })
        .getCssProperty('#nav-slide-next', 'visibility').then(style => {
          assert.equal(style.value, 'hidden');
        })

        ;
    });

  });

  describe('Launch error.baldr', function () {
    this.timeout(10000);

    beforeEach(function () {
      this.spectron = new Spectron('test/files/error.baldr');
      this.app = this.spectron.getApp();
      return this.spectron.start();
    });

    afterEach(function () {
      return this.spectron.stop();
    });

    it('Error text', function () {
      return this.app.client
        .click('#nav-slide-next')
        .getText('#slide').then(text => {
          assert.ok(text.includes('Uncaught Error: Master slide “question”: Invalid data input'));
        })

        ;
    });

  });

});
