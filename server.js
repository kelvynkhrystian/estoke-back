import app from './src/app.js'
import { testConnection } from './src/config/database.js'

const PORT = process.env.PORT || 3000

app.listen(PORT, async () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`)

  // 🔥 testa banco sem derrubar o app
  await testConnection()
})