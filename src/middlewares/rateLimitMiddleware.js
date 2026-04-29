import rateLimit from 'express-rate-limit';

// 🔐 LOGIN limiter
export const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Muitas tentativas de login. Tente novamente em 1 minuto.',
  },
});

// 🔁 REFRESH limiter
export const refreshLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Muitas requisições de refresh. Aguarde um momento.',
  },
});
