import express from 'express'
import * as productController from '../controllers/productController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { adminOnly } from '../middlewares/adminMiddleware.js'

const router = express.Router()

router.use(authMiddleware)

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Gerenciamento de produtos
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Listar produtos
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/', productController.getAll)

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Buscar produto por ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Produto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
router.get('/:id', productController.getById)

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Criar produto (admin)
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: Produto criado
 */
router.post('/', adminOnly, productController.create)

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Atualizar produto (admin)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       200:
 *         description: Produto atualizado
 */
router.put('/:id', adminOnly, productController.update)

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Remover produto (admin)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Produto removido
 */
router.delete('/:id', adminOnly, productController.remove)

export default router