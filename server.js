import app from './src/app.js'
import logger from './src/config/logger.js'

const PORT = process.env.PORT || 3000

console.log('🔥 APP STARTANDO...')

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} 🚀`)
})


process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', err)
})

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection', err)
})