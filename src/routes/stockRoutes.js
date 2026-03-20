import express from 'express'
import * as stockController from '../controllers/stockController.js'

const router = express.Router()

router.get('/', stockController.getAll)
router.post('/moviment', stockController.moviment)

export default router