import express from 'express'

const app = express()

app.use(express.json())

app.get('/api', (req, res) => {
  res.status(200).send({
    success: 'true',
    message: 'todos retrieved successfully',
  })
})

app.post('/api/store', (req, res) => {
  console.log(req.body)
  res.json({requestBody: req.body})
})

const PORT = 5000

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})