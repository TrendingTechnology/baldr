process.env.TS_NODE_PROJECT = '../tsconfig.json';
import 'ts-mocha'
import Mocha from  'mocha'

export function runTests() {
  const mocha = new Mocha();
  mocha.addFile('./specs/test.ts')
  mocha.run((failures) => {
    process.on('exit', () => {
      process.exit(failures) // exit with non-zero status if there were failures
    })
  })
}
