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
    const category = await categoryService.getCategoryById(req.params.id)

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
    if (!req.body.name) {
      return res.status(400).json({ error: 'Nome obrigatório' })
    }

    const data = await categoryService.createCategory(req.body)

    res.status(201).json(data)
  } catch (error) {
    console.error(error) // 🔥 IMPORTANTE
    res.status(500).json({ error: error.message })
  }
}

// UPDATE
export const update = async (req, res) => {
  try {
    const { id } = req.params

    if (!req.body.name) {
      return res.status(400).json({ error: 'Nome obrigatório' })
    }

    const data = await categoryService.updateCategory(id, req.body)

    res.json(data)
  } catch (error) {
    console.error(error) // 🔥 IMPORTANTE
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