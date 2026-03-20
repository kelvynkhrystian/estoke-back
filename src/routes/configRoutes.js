import express from 'express'
import * as configController from '../controllers/configController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { adminOnly } from '../middlewares/adminMiddleware.js'

const router = express.Router()

// aplica para TODAS as rotas daqui pra baixo
router.use(authMiddleware, adminOnly)

router.get('/', configController.get)
router.put('/', configController.update)

export default router