import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import app from './src/app.js';
import { testConnection } from './src/config/database.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

// 🔥 SERVIR ARQUIVOS ESTÁTICOS (ANTES DO LISTEN)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, async () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  await testConnection();
});
