import express from 'express'
import * as configController from '../controllers/configController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { adminOnly } from '../middlewares/adminMiddleware.js'

const router = express.Router()

// 🔐 todas as rotas exigem admin
router.use(authMiddleware, adminOnly)

/**
 * @swagger
 * tags:
 *   name: Config
 *   description: Configurações do sistema
 */

/**
 * @swagger
 * /config:
 *   get:
 *     summary: Obter configurações do sistema (admin)
 *     tags: [Config]
 *     responses:
 *       200:
 *         description: Configurações retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Config'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get('/', configController.get)

/**
 * @swagger
 * /config:
 *   put:
 *     summary: Atualizar configurações do sistema (admin)
 *     tags: [Config]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConfigInput'
 *     responses:
 *       200:
 *         description: Configuração atualizada com sucesso
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.put('/', configController.update)

export default router