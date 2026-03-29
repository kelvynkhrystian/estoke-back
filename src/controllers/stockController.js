import * as stockService from '../services/stockService.js'

// LISTAR ESTOQUE
export const getAll = async (req, res) => {
  try {
    const { store_id } = req.user
    const { type } = req.query

    const data = await stockService.getStock(store_id, type)

    res.json(data)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}

// LISTAR MOVIMENTOS
export const getMovements = async (req, res) => {
  try {
    const { store_id } = req.user
    const { type } = req.query

    const data = await stockService.getMovements(store_id, type)
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// MOVIMENTAÇÃO
export const moviment = async (req, res) => {
  try {
    const { item_id, quantity, type, reason, notes, item_type } = req.body
    const { store_id, id: created_by } = req.user

    if (!item_id || !quantity || !type || !item_type) {
      return res.status(400).json({ error: 'Dados inválidos' })
    }

    const data = await stockService.movimentStock({
      item_id,
      quantity,
      type,
      store_id,
      created_by,
      reason,
      notes,
      item_type,
      reference_type: 'MANUAL'
    })

    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}