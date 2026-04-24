import * as productService from '../services/productService.js';

// GET ALL
export const getAll = async (req, res) => {
  try {
    const data = await productService.getAllProducts();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET BY ID
export const getById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREATE
export const create = async (req, res) => {
  try {
    const data = req.body;

    if (!data.name || !data.category_id) {
      return res.status(400).json({ error: 'Nome e categoria obrigatórios' });
    }

    const product = await productService.createProduct(data);

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
export const update = async (req, res) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE
export const remove = async (req, res) => {
  try {
    const data = await productService.deleteProduct(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
