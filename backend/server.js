import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

import { pool } from './config/db.js'
import authRouter from './routes/auth.js'
import productosRouter from './routes/productos.js'
import clientesRouter from './routes/clientes.js'
import ventasRouter from './routes/ventas.js'
import dashboardRouter from './routes/dashboard.js'
import usuariosRouter from './routes/usuarios.js'

const app = express()
const PORT = process.env.PORT || 8080

app.use(cors())
app.use(express.json({ limit: '1mb' }))
app.use(morgan('dev'))

app.get('/', (req, res) => {
  res.json({
    message: '🚀 Backend Botica – MySQL (XAMPP) con roles',
    version: '1.1.0',
    endpoints: {
      auth: '/api/auth',
      productos: '/api/productos',
      ventas: '/api/ventas',
      clientes: '/api/clientes',
      dashboard: '/api/dashboard',
      usuarios: '/api/usuarios'
    }
  })
})

app.use((req, _res, next) => { req.pool = pool; next() })

app.use('/api/auth', authRouter)
app.use('/api/productos', productosRouter)
app.use('/api/clientes', clientesRouter)
app.use('/api/ventas', ventasRouter)
app.use('/api/dashboard', dashboardRouter)
app.use('/api/usuarios', usuariosRouter)

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err)
  res.status(err.status || 500).json({ message: err.message || 'Error interno' })
})

app.listen(PORT, () => {
  console.log(`✅ Botica backend (MySQL + roles) en http://127.0.0.1:${PORT}`)
})
