import express from "express"
import * as stockController from "../controllers/stockController.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"

const router = express.Router()

router.use(authMiddleware)

// 📦 ESTOQUE
router.get("/", stockController.getAll)

// 📊 MOVIMENTOS
router.get("/movements", stockController.getMovements)

// 🔁 MOVIMENTAÇÃO
router.post("/movements", stockController.moviment) 


// 🔄 TRANSFERÊNCIA
router.post("/transfer", stockController.transferStock)

export default router
