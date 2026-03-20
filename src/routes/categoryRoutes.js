import express from 'express'
import * as categoryController from '../controllers/categoryController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { adminOnly } from '../middlewares/adminMiddleware.js'

const router = express.Router()

// 🔐 todas precisam estar logadas
router.use(authMiddleware)

// 🔓 leitura (employee + admin)
router.get('/', categoryController.getAll)
router.get('/:id', categoryController.getById)

// 🔒 admin only
router.post('/', adminOnly, categoryController.create)
router.put('/:id', adminOnly, categoryController.update)
router.delete('/:id', adminOnly, categoryController.remove)

export default router