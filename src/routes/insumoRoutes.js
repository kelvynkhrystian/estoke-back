import { Router } from 'express';
import * as insumoController from '../controllers/insumoController.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Insumos
 *   description: Gerenciamento de insumos
 */

/**
 * @swagger
 * /insumos:
 *   get:
 *     summary: Lista todos os insumos
 *     tags: [Insumos]
 *     responses:
 *       200:
 *         description: Lista de insumos
 */
router.get('/', insumoController.getAll);

/**
 * @swagger
 * /insumos/{id}:
 *   get:
 *     summary: Busca um insumo por ID
 *     tags: [Insumos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Insumo encontrado
 *       404:
 *         description: Insumo não encontrado
 */
router.get('/:id', insumoController.getById);

/**
 * @swagger
 * /insumos:
 *   post:
 *     summary: Cria um novo insumo
 *     tags: [Insumos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Queijo
 *               unit:
 *                 type: string
 *                 example: kg
 *               min_stock:
 *                 type: number
 *                 example: 3
 *               is_active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Insumo criado com sucesso
 */
router.post('/', insumoController.create);

/**
 * @swagger
 * /insumos/{id}:
 *   put:
 *     summary: Atualiza um insumo
 *     tags: [Insumos]
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
 *                 example: Queijo Mussarela
 *               unit:
 *                 type: string
 *                 example: kg
 *               min_stock:
 *                 type: number
 *                 example: 5
 *               is_active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Insumo atualizado com sucesso
 *       404:
 *         description: Insumo não encontrado
 */
router.put('/:id', insumoController.update);

/**
 * @swagger
 * /insumos/{id}:
 *   delete:
 *     summary: Remove um insumo
 *     tags: [Insumos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Insumo removido com sucesso
 *       404:
 *         description: Insumo não encontrado
 */
router.delete('/:id', insumoController.remove);

export default router;
