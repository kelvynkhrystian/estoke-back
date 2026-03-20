import express from 'express'
import pool from './config/database.js'

import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import stockRoutes from './routes/stockRoutes.js'
import saleRoutes from './routes/saleRoutes.js'
import configRoutes from './routes/configRoutes.js'
import storeRoutes from './routes/storeRoutes.js'
import authRoutes from './routes/authRoutes.js'



const app = express()

app.use(express.json())

// teste de conexão
app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1')
    res.json({ message: 'Banco conectado 🚀', rows })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})


app.use('/categories', categoryRoutes)
app.use('/products', productRoutes)
app.use('/stock', stockRoutes)
app.use('/sales', saleRoutes)
app.use('/config', configRoutes)
app.use('/stores', storeRoutes)
app.use('/auth', authRoutes)


export default app