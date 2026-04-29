import express from 'express';
import * as stockController from '../controllers/stockController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Estoque
 *   description: Controle de estoque e movimentações
 */

/**
 * @swagger
 * /stock:
 *   get:
 *     summary: Lista o estoque atual
 *     tags: [Estoque]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de itens em estoque
 *       401:
 *         description: Não autorizado
 */
router.get('/', stockController.getAll);

/**
 * @swagger
 * /stock/movements:
 *   get:
 *     summary: Lista movimentações de estoque
 *     tags: [Estoque]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de movimentações
 */
router.get('/movements', stockController.getMovements);

/**
 * @swagger
 * /stock/movements:
 *   post:
 *     summary: Realiza uma movimentação de estoque
 *     tags: [Estoque]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [item_id, item_type, quantity, type]
 *             properties:
 *               item_id:
 *                 type: integer
 *                 example: 1
 *               item_type:
 *                 type: string
 *                 enum: [PRODUCT, INSUMO]
 *                 example: PRODUCT
 *               quantity:
 *                 type: number
 *                 example: 5
 *               type:
 *                 type: string
 *                 enum: [IN, OUT, ADJUST]
 *                 example: OUT
 *               reason:
 *                 type: string
 *                 example: VENDA
 *               notes:
 *                 type: string
 *                 example: Venda no balcão
 *     responses:
 *       200:
 *         description: Movimentação realizada com sucesso
 */
router.post('/movements', stockController.moviment);

/**
 * @swagger
 * /stock/transfer:
 *   post:
 *     summary: Realiza transferência de estoque entre lojas
 *     tags: [Estoque]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [from_store_id, to_store_id, items]
 *             properties:
 *               from_store_id:
 *                 type: integer
 *                 example: 1
 *               to_store_id:
 *                 type: integer
 *                 example: 2
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [item_id, item_type, quantity]
 *                   properties:
 *                     item_id:
 *                       type: integer
 *                       example: 1
 *                     item_type:
 *                       type: string
 *                       enum: [PRODUCT, INSUMO]
 *                       example: PRODUCT
 *                     quantity:
 *                       type: number
 *                       example: 10
 *     responses:
 *       200:
 *         description: Transferência realizada com sucesso
 */
router.post('/transfer', stockController.transferStock);

export default router;
