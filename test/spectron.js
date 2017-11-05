const {
  assert,
  fs,
  path,
  Spectron
} = require('baldr-test');

const rewire = require('rewire');

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

      .click('#button-right')
      .getText('.question')
      .then(text => {
        assert.equal(text, 'When did Ludwig van Beethoven die?');
      })

      .click('#button-right')
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

      .click('#button-down')
      .getText('li:nth-child(2) .question').then(text => {
        assert.equal(text, 'two');
      })

      .click('#button-down')
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
      .click('#button-up')
      .getText('li:nth-child(1) .question').then(text => {
        assert.equal(text, 'one');
      })
      .getText('li:nth-child(2) .question').then(text => {
        assert.equal(text, 'two');
      })
      .getText('li:nth-child(3) .question').then(text => {
        assert.equal(text, 'three');
      })

      .click('#button-up')
      .getText('li:nth-child(3) .question').then(text => {
        assert.equal(text, '');
      })

      .click('#button-up')
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
      .click('#button-down')
      .getText('li:nth-child(1) .question').then(text => {
        assert.equal(text, 'one');
      })
      .getText('li:nth-child(2) .question').then(text => {
        assert.equal(text, 'two');
      })
      .getText('li:nth-child(3) .question').then(text => {
        assert.equal(text, '');
      })

      .click('#button-right')
      .getText('.question').then(text => {
        assert.equal(text, 'Without steps');
      })

      .click('#button-left')
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
      .getCssProperty('#button-down', 'visibility').then(style => {
        assert.equal(style.value, 'visible');
      })
      .getCssProperty('#button-up', 'visibility').then(style => {
        assert.equal(style.value, 'visible');
      })
      .getCssProperty('#button-left', 'visibility').then(style => {
        assert.equal(style.value, 'visible');
      })
      .getCssProperty('#button-right', 'visibility').then(style => {
        assert.equal(style.value, 'visible');
      })

      .click('#button-right')
      .getCssProperty('#button-down', 'visibility').then(style => {
        assert.equal(style.value, 'hidden');
      })
      .getCssProperty('#button-up', 'visibility').then(style => {
        assert.equal(style.value, 'hidden');
      })

      .click('#button-left')
      .getCssProperty('#button-down', 'visibility').then(style => {
        assert.equal(style.value, 'visible');
      })
      .getCssProperty('#button-up', 'visibility').then(style => {
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
      .getCssProperty('#button-left', 'visibility').then(style => {
        assert.equal(style.value, 'hidden');
      })
      .getCssProperty('#button-right', 'visibility').then(style => {
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
      .click('#button-right')
      .getText('#slide').then(text => {
        assert.ok(text.includes('Uncaught Error: Master slide “question”: Invalid data input'));
      })

      ;
  });

});
