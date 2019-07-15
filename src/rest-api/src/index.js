import express from 'express'
import fs from 'fs'
// import path from 'path'

const PORT = 5000
// const STOREDIR = path.join('/', 'var', 'data')
const app = express()

app.use(express.json())

app.get('/api', (req, res) => {
  res.status(200).send({
    success: 'true',
    message: 'todos retrieved successfully'
  })
})

app.post('/api/store', (req, res) => {
  const timeStampMsec = new Date().getTime()
  const body = JSON.stringify(req.body)
  fs.writeFile(`./seating-plan_${timeStampMsec}.json`, body, { encoding: 'utf-8' }, (err) => {
    if (err) throw err
    console.log('The file has been saved!')
  })

  const responseMessage = {
    timeStampMsec: timeStampMsec,
    storedObject: req.body
  }
  res.json(responseMessage)
  console.log(responseMessage)
})

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})
