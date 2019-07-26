/* globals describe it after */

const fs = require('fs')
const path = require('path')

const chai = require('chai')
const { assert } = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const { stop, store } = require('../index')
const packageJson = require('../package.json')

chai.should()

let timeStampMsec

chai.use(chaiHttp)

describe('BALDR REST API', () => {
  after(async () => {
    stop()
  })

  it('GET /api/version', (done) => {
    chai.request(server)
      .get('/api/version')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.eql({ version: packageJson.version })
        if (err) throw err
        done()
      })
  })

  it('POST /api/seating-plan', (done) => {
    chai.request(server)
      .post('/api/seating-plan')
      .send({ timeStampMsec: 1234, test: 'test' })
      .end((err, res) => {
        res.should.have.status(200)
        const body = res.body
        timeStampMsec = body.storedObject.timeStampMsec
        body.storedObject.should.be.eql({ timeStampMsec: 1234, test: 'test' })
        body.success.should.be.a('number')
        body.success.should.be.eql(1234)
        assert.isTrue(fs.existsSync(path.join(store, 'latest')))
        assert.isTrue(
          fs.existsSync(
            path.join(store, `seating-plan_${timeStampMsec}.json`)
          )
        )
        if (err) throw err
        done()
      })
  })

  it('GET /api/seating-plan', (done) => {
    chai.request(server)
      .get('/api/seating-plan')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.an('array')
        res.body.length.should.be.equal(1)
        if (err) throw err
        done()
      })
  })

  it('GET /api/seating-plan/latest', (done) => {
    chai.request(server)
      .get('/api/seating-plan/latest')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.an('object')
        res.body.should.be.eql({ timeStampMsec: 1234, test: 'test' })
        if (err) throw err
        done()
      })
  })

  it(`GET /api/seating-plan/by-time/:timeStampMsec`, (done) => {
    chai.request(server)
      .get(`/api/seating-plan/by-time/${timeStampMsec}`)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.an('object')
        res.body.should.be.eql({ timeStampMsec: timeStampMsec, test: 'test' })
        if (err) throw err
        done()
      })
  })

  it('GET /api/seating-plan/by-time/:timeStampMsec: None existing timeStamp', (done) => {
    chai.request(server)
      .get('/api/seating-plan/by-time/xxx')
      .end((err, res) => {
        res.should.have.status(404)
        if (err) throw err
        done()
      })
  })

  it('DELETE /api/seating-plan/by-time/:timeStampMsec', (done) => {
    chai.request(server)
      .delete(`/api/seating-plan/by-time/${timeStampMsec}`)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.an('object')
        res.body.timeStampMsec.should.be.an('string')
        assert.isNotOk(
          fs.existsSync(
            path.join(
              store,
              `seating-plan_${timeStampMsec}.json`
            )
          )
        )
        if (err) throw err
        done()
      })
  })
})
