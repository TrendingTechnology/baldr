/* globals describe it after */

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const { stop } = require('../index')
const packageJson = require('../package.json')

chai.should()

chai.use(chaiHttp)

describe('BALDR REST API', () => {
  after(async () => {
    stop()
  })
  it('/api/version', (done) => {
    chai.request(server)
      .get('/api/version')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.eql({ version: packageJson.version })
        if (err) throw err
        done()
      })
  })
})
