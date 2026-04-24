import winston from 'winston';

const logger = winston.createLogger({
  level: 'info', // Nível mínimo de log
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() // Salva como JSON (melhor para ler depois)
  ),
  transports: [
    // 1. Salva todos os logs de erro em um arquivo separado
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    // 2. Salva todos os logs gerais (info, warn, error) em outro arquivo
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Se não estiver em produção, também exibe no console com cores
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

export default logger;
