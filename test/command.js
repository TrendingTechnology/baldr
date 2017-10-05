const {assert} = require('./lib/helper.js');
const spawn = require('child_process').spawnSync;
const command = require('rewire')('../command.js');
const path = require('path');
const fs = require('fs');
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

var read = function(file) {
  return fs.readFileSync(file, 'utf-8');
};
describe('file “command.js”', () => {

  describe('require as module', () => {

    it('--path', () => {
      let rewire = invokeCommand(['--path', 'songs']);
      let commander = rewire.__get__('commander');
      assert.equal(commander.path, 'songs');
    });

    it('--tex', () => {
      let rewire = invokeCommand(['--path', 'songs_min_processed', '--tex']);
      let commander = rewire.__get__('commander');
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
      let commander = rewire.__get__('commander');
      let json = path.join('songs_min_processed', 'songs.json');
      assert.exists(json);
      assert.equal(
        read(json),
        read(path.join('test', 'files', 'songs_min_processed.json'))
      );
      fs.unlinkSync(json);
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

    // After --force
    it('--json', () => {
      const cli = spawn('./command.js', ['--test', '--json']);
    });

    // After --force
    it('--tex', () => {
      const cli = spawn('./command.js', ['--test', '--tex']);
    });

    it.skip('--folder', () => {
      const cli = spawn('./command.js', ['--test', '--folder', 'Swing-low']);
      assert.exists('Swing-low', 'piano', 'piano.eps');
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
