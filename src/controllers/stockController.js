import * as stockService from '../services/stockService.js'

// LISTAR ESTOQUE
export const getAll = async (req, res) => {
  try {
    const data = await stockService.getStock()
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

    const data = await stockService.movimentStock(req.body)
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}