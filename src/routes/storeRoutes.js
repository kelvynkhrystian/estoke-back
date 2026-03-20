import express from 'express'
import * as storeController from '../controllers/storeController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { adminOnly } from '../middlewares/adminMiddleware.js'

const router = express.Router()

// 🔐 todas precisam estar logadas
router.use(authMiddleware)

// 🔓 todos podem ver
router.get('/', storeController.getAll)

// 🔒 só admin cria
router.post('/', adminOnly, storeController.create)

export default router