import express from 'express'

const app = express()
const port = Number(process.env.PORT) || 3001

app.get('/', (req, res) => {
  res.json({ message: 'SIPROD API' })
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`)
})
