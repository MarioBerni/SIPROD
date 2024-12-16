import express from 'express'

const app = express()
const port = Number(process.env.PORT) || 4000

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`)
  next()
})

// Health Check
app.get('/api/health', (req, res) => {
  console.log('Health check endpoint called')
  res.status(200).json({ status: 'ok' })
})

// API Routes
app.get('/', (req, res) => {
  res.json({ message: 'SIPROD API' })
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port} in ${process.env.NODE_ENV} mode`)
  console.log(`Health check endpoint: http://localhost:${port}/api/health`)
})
