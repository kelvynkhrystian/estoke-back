import * as saleService from '../services/saleService.js'

// GET ALL
export const getAll = async (req, res) => {
  try {
    const { store_id, role } = req.user
    const data = await saleService.getSales(store_id, role)
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// GET BY ID
export const getById = async (req, res) => {
  try {
    const { store_id, role } = req.user
    const data = await saleService.getSaleById(req.params.id, store_id, role)

    if (!data) {
      return res.status(404).json({ error: 'Venda não encontrada' })
    }

    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// CREATE
export const create = async (req, res) => {
  try {
    const { id: created_by, store_id } = req.user
    const { items } = req.body

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Itens obrigatórios' })
    }

    const data = await saleService.createSale({
      items,
      store_id,
      created_by
    })

    res.status(201).json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}