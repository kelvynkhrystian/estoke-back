import express from 'express'
import * as saleController from '../controllers/saleController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.use(authMiddleware)

/**
 * @swagger
 * tags:
 *   name: Sales
 *   description: Gerenciamento de vendas
 */

/**
 * @swagger
 * /sales:
 *   get:
 *     summary: Listar vendas
 *     tags: [Sales]
 */
router.get('/', saleController.getAll)

/**
 * @swagger
 * /sales/{id}:
 *   get:
 *     summary: Buscar venda por ID
 *     tags: [Sales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 */
router.get('/:id', saleController.getById)

/**
 * @swagger
 * /sales:
 *   post:
 *     summary: Criar venda
 *     tags: [Sales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SaleInput'
 */
router.post('/', saleController.create)

export default router