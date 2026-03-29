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
    const { name, is_active } = req.body

    if (!name) {
      return res.status(400).json({ error: 'Nome obrigatório' })
    }

    const data = await storeService.createStore({
      name,
      is_active: is_active ?? 1
    })

    res.status(201).json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// ✏️ ATUALIZAR
export const update = async (req, res) => {
  try {
    const { id } = req.params
    const { name, is_active } = req.body

    if (!name) {
      return res.status(400).json({ error: 'Nome obrigatório' })
    }

    const data = await storeService.updateStore(id, {
      name,
      is_active
    })

    if (!data) {
      return res.status(404).json({ error: 'Loja não encontrada' })
    }

    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// 🗑️ REMOVER PERMANENTEMENTE (HARD DELETE)
export const remove = async (req, res) => {
  try {
    const { id } = req.params

    // Chamando o service que executa a exclusão real
    const data = await storeService.hardDeleteStore(id)

    if (!data) {
      return res.status(404).json({ error: 'Loja não encontrada' })
    }

    // Mensagem atualizada para refletir a realidade
    res.json({ message: 'Loja removida permanentemente com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir loja:', error)
    res.status(500).json({ error: 'Erro ao excluir loja' })
  }
}