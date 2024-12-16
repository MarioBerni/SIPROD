import express from 'express'

const app = express()
const port = Number(process.env.PORT) || 4000

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

// API Routes
app.get('/', (req, res) => {
  res.json({ message: 'SIPROD API' })
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`)
})
