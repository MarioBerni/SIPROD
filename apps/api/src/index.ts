import express from 'express'
import cors from 'cors'

const app = express()
const port = Number(process.env.PORT) || 4000
const API_PREFIX = process.env.API_PREFIX || '/api'

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Log all requests
app.use((req) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`)
})

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal Server Error' })
})

// Health Check (sin prefijo API para acceso directo)
app.get('/health', (req, res) => {
  console.log('Health check endpoint called')
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  })
})

// API Routes con prefijo
const apiRouter = express.Router()

apiRouter.get('/', (req, res) => {
  res.json({ 
    message: 'SIPROD API',
    version: '1.0.0',
    environment: process.env.NODE_ENV
  })
})

// Aplicar el prefijo API a todas las rutas del apiRouter
app.use(API_PREFIX, apiRouter)

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port} in ${process.env.NODE_ENV} mode`)
  console.log(`Health check endpoint: http://localhost:${port}/health`)
  console.log(`API endpoint: http://localhost:${port}${API_PREFIX}`)
})
