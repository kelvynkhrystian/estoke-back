import express from 'express'
import * as authController from '../controllers/authController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { adminOnly } from '../middlewares/adminMiddleware.js'

const router = express.Router()

// LOGIN
router.post('/login', authController.login)

// REGISTER (só admin)
router.post('/register', authMiddleware, adminOnly, authController.register)

// 🔁 REFRESH
router.post('/refresh', authController.refresh)

// 🚪 LOGOUT
router.post('/logout', authController.logout)

export default router