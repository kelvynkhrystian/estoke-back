import { Router } from 'express';
import * as insumoController from '../controllers/insumoController.js';

const router = Router();

router.get('/', insumoController.getAll);
router.get('/:id', insumoController.getById);
router.post('/', insumoController.create);
router.put('/:id', insumoController.update);
router.delete('/:id', insumoController.remove);

export default router;
