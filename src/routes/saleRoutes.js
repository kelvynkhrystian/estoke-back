import express from 'express'
import * as saleController from '../controllers/saleController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

// 🔐 todas precisam estar logadas
router.use(authMiddleware)

// 🔓 employee + admin
router.get('/', saleController.getAll)
router.get('/:id', saleController.getById)
router.post('/', saleController.create)

export default router