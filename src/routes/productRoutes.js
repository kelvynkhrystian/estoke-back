import express from 'express'
import * as productController from '../controllers/productController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { adminOnly } from '../middlewares/adminMiddleware.js'

const router = express.Router()

// 🔐 todas precisam estar logadas
router.use(authMiddleware)

// 🔓 leitura (employee + admin)
router.get('/', productController.getAll)
router.get('/:id', productController.getById)

// 🔒 admin only
router.post('/', adminOnly, productController.create)
router.put('/:id', adminOnly, productController.update)
router.delete('/:id', adminOnly, productController.remove)

export default router