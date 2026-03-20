import * as categoryService from '../services/categoryService.js'

// GET ALL
export const getAll = async (req, res) => {
  try {
    const data = await categoryService.getAllCategories()
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// GET BY ID
export const getById = async (req, res) => {
  try {
    const category = await categoryService.getById(req.params.id)

    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada' })
    }

    res.json(category)
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

    const data = await categoryService.createCategory(name)
    res.status(201).json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// UPDATE
export const update = async (req, res) => {
  try {
    const { name } = req.body
    const { id } = req.params

    if (!name) {
      return res.status(400).json({ error: 'Nome obrigatório' })
    }

    const data = await categoryService.updateCategory(id, name)
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// DELETE
export const remove = async (req, res) => {
  try {
    const { id } = req.params
    const data = await categoryService.deleteCategory(id)
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}