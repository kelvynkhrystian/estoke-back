import express from "express"; // 👈 faltava isso
import app from './src/app.js'
import { testConnection } from './src/config/database.js'
import path from "path";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 3000


app.listen(PORT, async () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`)

  // 🔥 testa banco sem derrubar o app
  await testConnection()
})
