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