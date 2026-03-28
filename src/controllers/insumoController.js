import * as insumoService from '../services/insumoService.js'

// GET ALL
export const getAll = async (req, res) => {
  try {
    const data = await insumoService.getAllInsumos()
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// GET BY ID
export const getById = async (req, res) => {
  try {
    const data = await insumoService.getInsumoById(req.params.id)

    if (!data) {
      return res.status(404).json({ error: 'Insumo não encontrado' })
    }

    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// CREATE
export const create = async (req, res) => {
  try {
    const { name } = req.body

    if (!name) {
      return res.status(400).json({ error: 'Nome obrigatório' })
    }

    const data = await insumoService.createInsumo(req.body)
    res.status(201).json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// UPDATE
export const update = async (req, res) => {
  try {
    const { id } = req.params
    const data = await insumoService.updateInsumo(id, req.body)
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// DELETE
export const remove = async (req, res) => {
  try {
    const { id } = req.params
    const data = await insumoService.deleteInsumo(id)
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}