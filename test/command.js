const {assert} = require('./lib/helper.js');
const spawn = require('child_process').spawnSync;

before(() => {
  process.env.PATH = __dirname + '/bin:' + process.env.PATH;
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
  it.skip('--tex', () => {
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
