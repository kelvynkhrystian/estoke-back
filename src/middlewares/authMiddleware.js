import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/jwt.js'

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não enviado' })
  }

  const [type, token] = authHeader.split(' ')

  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Token mal formatado' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch {
    return res.status(401).json({ error: 'Token inválido' })
  }
}