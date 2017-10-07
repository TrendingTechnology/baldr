const {assert} = require('./lib/helper.js');
const spawn = require('child_process').spawnSync;
const rewire = require('rewire');
const command = require('rewire')('../command.js');
const path = require('path');
const fs = require('fs');
const sinon = require('sinon');
process.env.PATH = __dirname + '/bin:' + process.env.PATH;

const baseArgv = [
  '/usr/bin/node',
  path.join(path.resolve('.'), 'command.js')
];

var invokeCommand = function(argv) {
  let main = command.__get__('main');
  command.__set__('process.argv',  baseArgv.concat(argv));
  main();
  return command;
};

var args = function(arg) {
  if (typeof arg == 'string') {
    return ['-', '-', arg];
  }
  else {
    return ['-', '-'].concat(arg);
  }
};

var read = function(file) {
  return fs.readFileSync(file, 'utf-8');
};
describe('file “command.js”', () => {

  describe('setOptions', () => {
    it.skip('--clean', () => {
      let setOptions = command.__get__('setOptions');
      let out = setOptions(args(['--clean']));
      console.log(out);
      assert.equal(out.clean, true);
    });
  });

  describe('require as module', () => {

    it('--path', () => {
      let rewire = invokeCommand(['--path', 'songs']);
      let commander = rewire.__get__('commander');
      assert.equal(commander.path, 'songs');
    });

    it('--tex', () => {
      let rewire = invokeCommand(['--path', 'songs_min_processed', '--tex']);
      let tex = path.join('songs_min_processed', 'songs.tex');

      assert.exists(tex);
      assert.equal(
        read(tex),
        read(path.join('test', 'files', 'songs_min_processed.tex'))
      );
      fs.unlinkSync(tex);
    });

    it('--json', () => {
      let rewire = invokeCommand(['--path', 'songs_min_processed', '--json']);
      let json = path.join('songs_min_processed', 'songs.json');
      assert.exists(json);
      assert.equal(
        read(json),
        read(path.join('test', 'files', 'songs_min_processed.json'))
      );
      fs.unlinkSync(json);
    });


    it('--folder', () => {
      let stub = sinon.stub();
      let message = rewire('../message.js');
      let index = rewire('../index.js');
      let command = rewire('../command.js');
      message.__set__('info', stub);
      index.__set__('message', message);
      command.__set__('index', index);

      let main = command.__get__('main');
      command.__set__('process.argv',  [
        '', '',
        '--test',
        '--folder',
        'songs/a/Auf-der-Mauer_auf-der-Lauer'
      ]);
      main();
      assert.equal(stub.args, '\u001b[32m☑\u001b[39m  \u001b[32mAuf-der-Mauer_auf-der-Lauer\u001b[39m: Auf der Mauer, auf der Lauer \u001b[31m(forced)\u001b[39m\n\t\u001b[33mslides\u001b[39m: 01.svg, 02.svg\n\t\u001b[33mpiano\u001b[39m: piano_1.eps, piano_2.eps');
    });
  });

  describe('Command line', () => {

    it('no arguments: normal update', () => {
      const cli = spawn('./command.js', ['--test']);
    });

    it('no arguments (second run): only json and TeX generation', () => {
      const cli = spawn('./command.js', ['--test']);
    });

    it('--force', () => {
      const cli = spawn('./command.js', ['--test', '--force']);
    });

    it('--help', () => {
      const cli = spawn('./command.js', ['--test', '--help']);
      var out = cli.stdout.toString();
      assert.ok(out.indexOf('Usage') > -1);
      assert.ok(out.indexOf('--help') > -1);
      assert.ok(out.indexOf('--version') > -1);
      assert.equal(cli.status, 0);
    });

    it('--version', () => {
      const cli = spawn('./command.js', ['--test', '--version']);
      assert.equal(cli.stdout.toString(), '0.0.5\n');
      assert.equal(cli.status, 0);
    });

    // Test should be executed at the very last position.
    it('--clean', () => {
      const cli = spawn('./command.js', ['--test', '--clean']);
    });

  });

});
