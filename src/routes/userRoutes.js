import express from 'express';

import * as userController from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminOnly } from '../middlewares/adminMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Gerenciamento de usuários
 */

// ============================
// ADMIN
// ============================

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Criar usuário (admin)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: João
 *               email:
 *                 type: string
 *                 example: user@email.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               role:
 *                 type: string
 *                 enum: [admin, manager, employee]
 *                 example: employee
 *               store_id:
 *                 type: number
 *                 example: 1
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 */
router.post('/', authMiddleware, adminOnly, userController.create);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Listar usuários (admin)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários
 */
router.get('/', authMiddleware, adminOnly, userController.list);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Buscar usuário por ID (admin)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/:id', authMiddleware, adminOnly, userController.findById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualizar usuário (admin)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, manager, employee]
 *               store_id:
 *                 type: number
 *     responses:
 *       200:
 *         description: Usuário atualizado
 */
router.put('/:id', authMiddleware, adminOnly, userController.update);

/**
 * @swagger
 * /users/{id}/status:
 *   patch:
 *     summary: Ativar ou desativar usuário (admin)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [is_active]
 *             properties:
 *               is_active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Status atualizado
 */
router.patch(
  '/:id/status',
  authMiddleware,
  adminOnly,
  userController.updateStatus
);

// ============================
// USUÁRIO LOGADO
// ============================

/**
 * @swagger
 * /users/me/email:
 *   put:
 *     summary: Atualizar email do usuário logado
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [new_email, password]
 *             properties:
 *               new_email:
 *                 type: string
 *                 example: novo@email.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Email atualizado
 */
router.put('/me/email', authMiddleware, userController.updateEmail);

/**
 * @swagger
 * /users/me/password:
 *   put:
 *     summary: Atualizar senha do usuário logado
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [current_password, new_password]
 *             properties:
 *               current_password:
 *                 type: string
 *                 example: 123456
 *               new_password:
 *                 type: string
 *                 example: 654321
 *     responses:
 *       200:
 *         description: Senha atualizada com sucesso
 */
router.put('/me/password', authMiddleware, userController.updatePassword);

export default router;
