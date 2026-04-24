import express from 'express';
import * as storeController from '../controllers/storeController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminOnly } from '../middlewares/adminMiddleware.js';

const router = express.Router();

// 🔐 todas precisam estar logadas
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Stores
 *   description: Gerenciamento de lojas
 */

/**
 * @swagger
 * /stores:
 *   get:
 *     summary: Listar todas as lojas
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de lojas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Store'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/', storeController.getAll);

/**
 * @swagger
 * /stores:
 *   post:
 *     summary: Criar nova loja (admin)
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StoreInput'
 *     responses:
 *       201:
 *         description: Loja criada com sucesso
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post('/', adminOnly, storeController.create);

/**
 * @swagger
 * /stores/{id}:
 *   put:
 *     summary: Atualizar loja (admin)
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da loja
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StoreInput'
 *     responses:
 *       200:
 *         description: Loja atualizada com sucesso
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         description: Loja não encontrada
 */
router.put('/:id', adminOnly, storeController.update);

/**
 * @swagger
 * /stores/{id}:
 *   delete:
 *     summary: Remover loja (admin)
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da loja
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Loja removida com sucesso
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         description: Loja não encontrada
 */
router.delete('/:id', adminOnly, storeController.remove);

export default router;
