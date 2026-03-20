import * as stockService from '../services/stockService.js'

// LISTAR ESTOQUE
export const getAll = async (req, res) => {
  try {
    // 🔥 por enquanto fixo (depois vem do login)
    const store_id = 1

    const data = await stockService.getStock(store_id)
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// MOVIMENTAR
export const moviment = async (req, res) => {
  try {
    const { product_id, quantity, type } = req.body

    if (!product_id || !quantity || !type) {
      return res.status(400).json({ error: 'Dados inválidos' })
    }

    // 🔥 FIXO POR ENQUANTO (até implementar login)
    const store_id = 1
    const created_by = 1

    const data = await stockService.movimentStock({
      product_id,
      quantity,
      type,
      store_id,
      created_by
    })

    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// LISTAR MOVIMENTAÇÕES
export const getMovements = async (req, res) => {
  try {
    const store_id = 1 // 🔥 fixo por enquanto

    const data = await stockService.getMovements(store_id)
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}