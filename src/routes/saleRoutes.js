import express from 'express'
import * as saleController from '../controllers/saleController.js'

const router = express.Router()

router.post('/', saleController.create)

export default router