import * as storeService from '../services/storeService.js'

export const getAll = async (req, res) => {
  try {
    const data = await storeService.getStores()
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const create = async (req, res) => {
  try {
    const { name } = req.body

    if (!name) {
      return res.status(400).json({ error: 'Nome obrigatório' })
    }

    const data = await storeService.createStore(name)
    res.status(201).json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const update = async (req, res) => {
  try {
    const { id } = req.params
    const { name } = req.body

    if (!name) {
      return res.status(400).json({ error: 'Nome obrigatório' })
    }

    const data = await storeService.updateStore(id, name)

    if (!data) {
      return res.status(404).json({ error: 'Loja não encontrada' })
    }

    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const remove = async (req, res) => {
  try {
    const { id } = req.params

    const data = await storeService.removeStore(id)

    if (!data) {
      return res.status(404).json({ error: 'Loja não encontrada' })
    }

    res.json({ message: 'Loja removida com sucesso' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}