import express from 'express'

const app = express()
const port = process.env.PORT || 3001

app.get('/', (req, res) => {
  res.json({ message: 'SIPROD API' })
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
