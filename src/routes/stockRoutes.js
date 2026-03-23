import express from 'express'
import * as stockController from '../controllers/stockController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.use(authMiddleware)

/**
 * @swagger
 * tags:
 *   name: Stock
 *   description: Controle de estoque
 */

/**
 * @swagger
 * /stock:
 *   get:
 *     summary: Listar estoque atual
 *     tags: [Stock]
 */
router.get('/', stockController.getAll)

/**
 * @swagger
 * /stock/movements:
 *   get:
 *     summary: Listar movimentações de estoque
 *     tags: [Stock]
 */
router.get('/movements', stockController.getMovements)

/**
 * @swagger
 * /stock/movements:
 *   post:
 *     summary: Registrar movimentação de estoque
 *     tags: [Stock]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StockMovementInput'
 */
router.post('/movements', stockController.moviment)

export default router