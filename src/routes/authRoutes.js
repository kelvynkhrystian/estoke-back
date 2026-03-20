import express from 'express'
import * as authController from '../auth/authController.js'

const router = express.Router()

router.post('/login', authController.login)

export default router