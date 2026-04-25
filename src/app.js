import express from 'express';
import pool from './config/database.js';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import stockRoutes from './routes/stockRoutes.js';
import saleRoutes from './routes/saleRoutes.js';
import configRoutes from './routes/configRoutes.js';
import storeRoutes from './routes/storeRoutes.js';
import insumoRoutes from './routes/insumoRoutes.js';

const app = express();
app.use(express.json());

// testando doc automatica
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(
  cors({
    origin: ['http://localhost:5173', 'https://app.pastelariadoj.com.br'],
    credentials: true,
  })
);

// api ON
app.get('/', (req, res) => {
  res.json({
    status: 'API ONLINE 🚀',
    name: 'Estoke API',
    version: '1.0.0',
  });
});

// teste de conexão
app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1');
    res.json({ message: 'Banco conectado 🚀', rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/stock', stockRoutes);
app.use('/sales', saleRoutes);
app.use('/config', configRoutes);
app.use('/stores', storeRoutes);
app.use('/insumos', insumoRoutes);

app.use((err, req, res) => {
  res.status(500).json({
    error: 'Erro interno do servidor',
  });
});
console.log('🔥 APP CARREGADO 2...');

export default app;
