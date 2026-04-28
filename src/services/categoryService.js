import { Category } from '../models/index.js';

// ============================
// LISTAR
// ============================
export const getAllCategories = async () => {
  const categories = await Category.findAll({
    order: [['id', 'DESC']],
  });

  return categories;
};

// ============================
// BUSCAR POR ID
// ============================
export const getCategoryById = async (id) => {
  const category = await Category.findByPk(id);

  if (!category) {
    throw new Error('Categoria não encontrada');
  }

  return category;
};

// ============================
// CRIAR
// ============================
export const createCategory = async (data) => {
  const category = await Category.create({
    name: data.name,
    is_active: data.is_active ?? true,
  });

  return category;
};

// ============================
// UPDATE
// ============================
export const updateCategory = async (id, data) => {
  const category = await Category.findByPk(id);

  if (!category) {
    throw new Error('Categoria não encontrada');
  }

  await category.update({
    name: data.name ?? category.name,
    is_active: data.is_active ?? category.is_active,
  });

  return category;
};

// ============================
// DELETE
// ============================
export const deleteCategory = async (id) => {
  const category = await Category.findByPk(id);

  if (!category) {
    throw new Error('Categoria não encontrada');
  }

  await category.destroy();

  return { message: 'Categoria deletada' };
};
