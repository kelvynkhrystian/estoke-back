import * as saleService from '../services/saleService.js'

export const create = async (req, res) => {
  try {
    const { items } = req.body

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Itens obrigatórios' })
    }

    const data = await saleService.createSale(req.body)
    res.status(201).json(data)

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


// GET ALL
export const getAll = async (req, res) => {
  try {
    const data = await saleService.getSales()
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// GET BY ID
export const getById = async (req, res) => {
  try {
    const data = await saleService.getSaleById(req.params.id)
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}