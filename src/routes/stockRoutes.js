import express from 'express'
import * as stockController from '../controllers/stockController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

// 🔐 todas precisam estar logadas
router.use(authMiddleware)

// 🔓 employee + admin
router.get('/', stockController.getAll)
router.get('/movements', stockController.getMovements)

// 🔓 employee pode movimentar (ou pode restringir depois)
router.post('/movements', stockController.moviment)

export default router