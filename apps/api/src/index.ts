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
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`)
  next()
})

// Health Check bajo el prefijo API para consistencia
app.get(`${API_PREFIX}/health`, (req, res) => {
  console.log('Health check endpoint called')
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    uptime: process.uptime()
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

// Error handling middleware (debe ir después de todas las rutas)
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal Server Error' })
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port} in ${process.env.NODE_ENV} mode`)
  console.log(`Health check endpoint: http://0.0.0.0:${port}${API_PREFIX}/health`)
  console.log(`API endpoint: http://0.0.0.0:${port}${API_PREFIX}`)
})
