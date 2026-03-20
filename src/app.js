import express from 'express'
import pool from './config/database.js'

import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import stockRoutes from './routes/stockRoutes.js'
import saleRoutes from './routes/saleRoutes.js'





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


export default app