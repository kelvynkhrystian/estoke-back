import express from 'express';

import * as userController from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminOnly } from '../middlewares/adminMiddleware.js';

const router = express.Router();

// Admin cria usuário/admin
router.post('/', authMiddleware, adminOnly, userController.create);

// Admin lista usuários
router.get('/', authMiddleware, adminOnly, userController.list);

// Admin busca usuário por ID
router.get('/:id', authMiddleware, adminOnly, userController.findById);

// Admin edita usuário
router.put('/:id', authMiddleware, adminOnly, userController.update);

// Admin ativa/desativa usuário
// router.patch('/:id/status', authMiddleware, adminOnly, userController.updateStatus);

// Usuário logado atualiza o próprio email
router.put('/me/email', authMiddleware, userController.updateEmail);

// Usuário logado atualiza a própria senha
router.put('/me/password', authMiddleware, userController.updatePassword);

export default router;
