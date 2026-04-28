import sequelize from '../config/database.js';
import { Insumo, ProductInsumo, Stock } from '../models/index.js';

// LISTAR
export const getAllInsumos = async () => {
  return await Insumo.findAll({
    order: [['id', 'DESC']],
  });
};

// BUSCAR POR ID
export const getInsumoById = async (id) => {
  const insumo = await Insumo.findByPk(id);

  if (!insumo) {
    throw new Error('Insumo não encontrado');
  }

  return insumo;
};

// CRIAR
export const createInsumo = async (data) => {
  const transaction = await sequelize.transaction();

  try {
    const { name, unit, min_stock, is_active } = data;

    const insumo = await Insumo.create(
      {
        name,
        unit: unit || 'und',
        min_stock: min_stock || 0,
        is_active: is_active ?? true,
      },
      { transaction }
    );

    await Stock.create(
      {
        store_id: 1,
        item_id: insumo.id,
        item_type: 'INSUMO',
        quantity: 0,
      },
      { transaction }
    );

    await transaction.commit();

    return insumo;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// UPDATE
export const updateInsumo = async (id, data) => {
  const insumo = await Insumo.findByPk(id);

  if (!insumo) {
    throw new Error('Insumo não encontrado');
  }

  await insumo.update({
    name: data.name ?? insumo.name,
    unit: data.unit ?? insumo.unit,
    min_stock: data.min_stock ?? insumo.min_stock,
    is_active: data.is_active ?? insumo.is_active,
  });

  return insumo;
};

// DELETE
export const deleteInsumo = async (id) => {
  const transaction = await sequelize.transaction();

  try {
    const insumo = await Insumo.findByPk(id, { transaction });

    if (!insumo) {
      throw new Error('Insumo não encontrado');
    }

    await ProductInsumo.destroy({
      where: { insumo_id: id },
      transaction,
    });

    await Stock.destroy({
      where: {
        item_id: id,
        item_type: 'INSUMO',
      },
      transaction,
    });

    await insumo.destroy({ transaction });

    await transaction.commit();

    return { message: 'Insumo deletado com sucesso' };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
