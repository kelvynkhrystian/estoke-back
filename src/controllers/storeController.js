import * as storeService from '../services/storeService.js'

// 🔍 LISTAR TODAS
export const getAll = async (req, res) => {
  try {
    const data = await storeService.getStores()
    res.json(data)
  } catch (error) {
    console.error('Erro ao listar lojas:', error)
    res.status(500).json({ error: 'Erro ao buscar lojas' })
  }
}

// 🔍 BUSCAR POR ID
export const getById = async (req, res) => {
  try {
    const { id } = req.params

    const store = await storeService.getStoreById(id)

    if (!store) {
      return res.status(404).json({ error: 'Loja não encontrada' })
    }

    res.json(store)
  } catch (error) {
    console.error('Erro ao buscar loja:', error)
    res.status(500).json({ error: 'Erro ao buscar loja' })
  }
}

// ➕ CRIAR
export const create = async (req, res) => {
  try {
    const { name } = req.body

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Nome obrigatório' })
    }

    const data = await storeService.createStore(name.trim())

    res.status(201).json(data)
  } catch (error) {
    console.error('Erro ao criar loja:', error)
    res.status(500).json({ error: 'Erro ao criar loja' })
  }
}

// ✏️ ATUALIZAR
export const update = async (req, res) => {
  try {
    const { id } = req.params
    const { name } = req.body

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Nome obrigatório' })
    }

    const data = await storeService.updateStore(id, name.trim())

    if (!data) {
      return res.status(404).json({ error: 'Loja não encontrada ou inativa' })
    }

    res.json(data)
  } catch (error) {
    console.error('Erro ao atualizar loja:', error)
    res.status(500).json({ error: 'Erro ao atualizar loja' })
  }
}

// 🗑️ REMOVER (SOFT DELETE)
export const remove = async (req, res) => {
  try {
    const { id } = req.params

    const data = await storeService.removeStore(id)

    if (!data) {
      return res.status(404).json({ error: 'Loja não encontrada' })
    }

    res.json({ message: 'Loja desativada com sucesso' })
  } catch (error) {
    console.error('Erro ao remover loja:', error)
    res.status(500).json({ error: 'Erro ao remover loja' })
  }
}